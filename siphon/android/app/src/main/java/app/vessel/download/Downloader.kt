package app.vessel.download

import android.content.Context
import app.vessel.data.db.DownloadDao
import app.vessel.data.db.DownloadEntity
import app.vessel.data.repo.DownloadRepository
import app.vessel.util.StorageSink
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.ensureActive
import okhttp3.Call
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.IOException
import java.util.concurrent.ConcurrentHashMap

/**
 * Executes a single download from start (or a resume offset) to completion.
 *
 * Transport preference:
 *  1. `directUrl` — the platform CDN's progressive file. Supports HTTP Range,
 *     so pause/resume continues where it stopped.
 *  2. `apiDownloadUrl` — the Siphon API proxy (needed for server-muxed 1080p+
 *     and MP3). No Range support; a resume restarts the transfer.
 *
 * Progress is flushed to Room on a 500 ms cadence; the DAO flow drives both
 * the UI and the service notifications.
 */
class Downloader(
    private val context: Context,
    private val dao: DownloadDao,
    private val repository: DownloadRepository,
    private val client: OkHttpClient,
) {

    class HttpStatusException(val code: Int) : IOException("HTTP $code")

    /** In-flight OkHttp calls keyed by download id, so [cancelActive] can abort the socket directly. */
    private val activeCalls = ConcurrentHashMap<Long, Call>()

    /**
     * Aborts the in-flight network call for [id], if any. `Call.cancel()`
     * closes the underlying socket, which immediately unblocks a thread
     * currently stuck in a blocking `read()` — coroutine cancellation alone
     * can't do that, since it's only checked between reads. Called by
     * [app.vessel.download.DownloadService] before cancelling the coroutine
     * job, so pause/cancel take effect right away instead of waiting for
     * whatever chunk the connection was stalled on.
     */
    fun cancelActive(id: Long) {
        activeCalls[id]?.cancel()
    }

    suspend fun execute(id: Long) {
        var entity = dao.byId(id) ?: return
        try {
            downloadOnce(entity)
        } catch (e: HttpStatusException) {
            // Expired signed token or stale CDN URL → refresh transport and retry once.
            if (e.code == 403 || e.code == 410 || e.code == 404) {
                entity = repository.refreshTransportUrls(entity)
                downloadOnce(entity)
            } else {
                throw e
            }
        }
    }

    private suspend fun downloadOnce(start: DownloadEntity) {
        var entity = start
        val useDirect = entity.directUrl != null
        val url = entity.directUrl ?: entity.apiDownloadUrl

        // Attach to the previous output when resuming a range-capable
        // transfer; otherwise begin a fresh file.
        var resumeFrom = 0L
        val sink: StorageSink
        if (useDirect && entity.outputUri != null && entity.downloadedBytes > 0) {
            sink = StorageSink.fromExisting(context, entity.outputUri!!)
            val onDisk = sink.currentSize()
            resumeFrom = if (onDisk >= 0) minOf(onDisk, entity.downloadedBytes) else entity.downloadedBytes
        } else {
            entity.outputUri?.let { runCatching { StorageSink.fromExisting(context, it).delete() } }
            sink = StorageSink.create(
                context = context,
                targetDir = enumValueOf(entity.targetDir),
                customTreeUri = entity.customTreeUri,
                fileName = entity.fileName,
                mimeType = StorageSink.mimeTypeFor(entity.container),
            )
            entity = entity.copy(outputUri = sink.uri.toString(), downloadedBytes = 0)
            dao.update(entity)
        }

        val request = Request.Builder()
            .url(url)
            .apply { if (resumeFrom > 0) header("Range", "bytes=$resumeFrom-") }
            .build()

        val call = client.newCall(request)
        // Registered so DownloadService.stopJob() can call cancelActive(id)
        // to close this socket directly — see the class doc on cancelActive
        // for why coroutine cancellation alone isn't enough here.
        activeCalls[entity.id] = call

        try {
            call.execute().use { response ->
                if (!response.isSuccessful) throw HttpStatusException(response.code)

                val body = response.body ?: throw IOException("Empty response body")
                val isPartial = response.code == 206
                val startOffset = if (isPartial) resumeFrom else 0L
                val reportedLength = body.contentLength()
                val totalBytes = when {
                    reportedLength > 0 -> startOffset + reportedLength
                    entity.totalBytes > 0 -> entity.totalBytes
                    else -> -1L
                }

                var downloaded = startOffset
                var windowBytes = 0L
                var windowStart = System.nanoTime()
                var speedBps = 0L

                sink.open(append = isPartial && startOffset > 0).use { out ->
                    val buffer = ByteArray(BUFFER_SIZE)
                    val input = body.byteStream()
                    while (true) {
                        currentCoroutineContext().ensureActive()
                        val read = input.read(buffer)
                        if (read == -1) break
                        out.write(buffer, 0, read)
                        downloaded += read
                        windowBytes += read

                        val now = System.nanoTime()
                        val windowNanos = now - windowStart
                        if (windowNanos >= FLUSH_INTERVAL_NANOS) {
                            val instant = windowBytes * 1_000_000_000L / windowNanos
                            // Exponential smoothing keeps the displayed speed calm.
                            speedBps = if (speedBps == 0L) instant else (speedBps * 7 + instant * 3) / 10
                            val eta = if (totalBytes > 0 && speedBps > 0) (totalBytes - downloaded) / speedBps else -1L
                            dao.updateProgress(entity.id, downloaded, totalBytes, speedBps, eta)
                            windowBytes = 0
                            windowStart = now
                        }
                    }
                    out.flush()
                }

                dao.updateProgress(entity.id, downloaded, if (totalBytes > 0) totalBytes else downloaded, 0, 0)
                // Verify strictly against the server's Content-Length; resolve-time
                // size estimates are not authoritative and must not fail a file.
                verify(entity.id, downloaded, if (reportedLength > 0) startOffset + reportedLength else -1L)
                sink.finalizeFile()
            }
        } catch (e: IOException) {
            // If this IOException is the socket closing because cancelActive()
            // aborted it, surface the real CancellationException so the
            // caller's pause/cancel handling runs instead of marking the
            // download FAILED. A genuine network IOException rethrows as-is.
            currentCoroutineContext().ensureActive()
            throw e
        } finally {
            activeCalls.remove(entity.id)
        }
    }

    /**
     * File verification: the transfer must have produced every byte the
     * server promised. Size estimates (totalBytes from resolve) are not
     * authoritative, so only a Content-Length mismatch fails the download.
     */
    private suspend fun verify(id: Long, downloaded: Long, expected: Long) {
        if (expected > 0 && downloaded < expected) {
            throw IOException("Incomplete download: $downloaded of $expected bytes")
        }
        dao.byId(id)?.let { dao.update(it.copy(verified = true)) }
    }

    private companion object {
        const val BUFFER_SIZE = 64 * 1024
        const val FLUSH_INTERVAL_NANOS = 500_000_000L // 500 ms
    }
}

package com.orwyx.player.data.files

import android.app.RecoverableSecurityException
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.content.IntentSender
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import com.orwyx.player.data.db.VideoDao
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

/** Result of a mutation that may need user consent via the system dialog. */
sealed interface FileOpResult {
    data object Success : FileOpResult
    /** Caller must launch this and retry on RESULT_OK (scoped-storage consent). */
    data class NeedsConsent(val intentSender: IntentSender) : FileOpResult
    data class Failure(val message: String) : FileOpResult
}

/**
 * Scoped-storage-correct delete/rename/share.
 *
 * On Android 11+ MediaStore.createDeleteRequest/createWriteRequest produce a single
 * system consent dialog; on Android 10 the same flow surfaces through
 * [RecoverableSecurityException].
 */
@Singleton
class FileOperations @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dao: VideoDao,
) {
    suspend fun delete(videoId: Long): FileOpResult = withContext(Dispatchers.IO) {
        val video = dao.byId(videoId) ?: return@withContext FileOpResult.Failure("Video not found")
        val uri = Uri.parse(video.uri)
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && uri.isMediaStoreUri()) {
                val pending = MediaStore.createDeleteRequest(context.contentResolver, listOf(uri))
                return@withContext FileOpResult.NeedsConsent(pending.intentSender)
            }
            context.contentResolver.delete(uri, null, null)
            dao.delete(videoId)
            FileOpResult.Success
        } catch (e: SecurityException) {
            (e as? RecoverableSecurityException)
                ?.let { FileOpResult.NeedsConsent(it.userAction.actionIntent.intentSender) }
                ?: FileOpResult.Failure(e.message ?: "Permission denied")
        } catch (e: Exception) {
            FileOpResult.Failure(e.message ?: "Delete failed")
        }
    }

    /** Call after the consent dialog returns RESULT_OK to finish a pending delete. */
    suspend fun confirmDeleted(videoId: Long) = withContext(Dispatchers.IO) {
        dao.delete(videoId)
    }

    suspend fun rename(videoId: Long, newTitle: String): FileOpResult = withContext(Dispatchers.IO) {
        val video = dao.byId(videoId) ?: return@withContext FileOpResult.Failure("Video not found")
        val sanitized = newTitle.trim().replace(Regex("[/\\\\:*?\"<>|]"), "_")
        if (sanitized.isEmpty()) return@withContext FileOpResult.Failure("Name cannot be empty")
        val extension = video.path.substringAfterLast('.', "")
        val newFileName = if (extension.isEmpty()) sanitized else "$sanitized.$extension"
        val uri = Uri.parse(video.uri)
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && uri.isMediaStoreUri()) {
                // Ask for write consent up front; the actual update happens in confirmRename.
                val pending = MediaStore.createWriteRequest(context.contentResolver, listOf(uri))
                return@withContext FileOpResult.NeedsConsent(pending.intentSender)
            }
            applyRename(videoId, uri, sanitized, newFileName, video.path)
        } catch (e: SecurityException) {
            (e as? RecoverableSecurityException)
                ?.let { FileOpResult.NeedsConsent(it.userAction.actionIntent.intentSender) }
                ?: FileOpResult.Failure(e.message ?: "Permission denied")
        } catch (e: Exception) {
            FileOpResult.Failure(e.message ?: "Rename failed")
        }
    }

    /** Completes a rename after write consent was granted. */
    suspend fun confirmRename(videoId: Long, newTitle: String): FileOpResult =
        withContext(Dispatchers.IO) {
            val video = dao.byId(videoId) ?: return@withContext FileOpResult.Failure("Video not found")
            val sanitized = newTitle.trim().replace(Regex("[/\\\\:*?\"<>|]"), "_")
            val extension = video.path.substringAfterLast('.', "")
            val newFileName = if (extension.isEmpty()) sanitized else "$sanitized.$extension"
            runCatching {
                applyRename(videoId, Uri.parse(video.uri), sanitized, newFileName, video.path)
            }.getOrElse { FileOpResult.Failure(it.message ?: "Rename failed") }
        }

    private suspend fun applyRename(
        videoId: Long,
        uri: Uri,
        newTitle: String,
        newFileName: String,
        oldPath: String,
    ): FileOpResult {
        val values = ContentValues().apply {
            put(MediaStore.Video.Media.DISPLAY_NAME, newFileName)
        }
        val updated = context.contentResolver.update(uri, values, null, null)
        if (updated <= 0) return FileOpResult.Failure("Rename rejected")
        val newPath = File(File(oldPath).parentFile, newFileName).absolutePath
        dao.applyRename(videoId, newTitle, newPath)
        return FileOpResult.Success
    }

    /** Share sheet for one video via its content URI (no file copying). */
    fun shareIntent(videoUri: String): Intent =
        Intent.createChooser(
            Intent(Intent.ACTION_SEND).apply {
                type = "video/*"
                putExtra(Intent.EXTRA_STREAM, Uri.parse(videoUri))
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            },
            null,
        )

    private fun Uri.isMediaStoreUri() = authority == MediaStore.AUTHORITY
}

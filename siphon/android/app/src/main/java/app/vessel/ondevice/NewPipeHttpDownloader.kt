package app.vessel.ondevice

import java.io.IOException
import okhttp3.OkHttpClient
import okhttp3.RequestBody.Companion.toRequestBody
import org.schabi.newpipe.extractor.downloader.Downloader
import org.schabi.newpipe.extractor.downloader.Request as NewPipeRequest
import org.schabi.newpipe.extractor.downloader.Response as NewPipeResponse
import okhttp3.Request as OkRequest

/**
 * Bridges NewPipeExtractor's internal HTTP calls (used to talk to YouTube's
 * own internal API) onto our existing OkHttpClient. This is what makes the
 * traffic go out from the user's own phone/network exactly like the real
 * YouTube app's traffic would, instead of through a shared backend server —
 * the whole point of resolving YouTube on-device.
 */
class NewPipeHttpDownloader(private val client: OkHttpClient) : Downloader() {

    override fun execute(request: NewPipeRequest): NewPipeResponse {
        val builder = OkRequest.Builder().url(request.url())

        when (request.httpMethod()) {
            "GET" -> builder.get()
            "HEAD" -> builder.head()
            else -> builder.method(
                request.httpMethod(),
                (request.dataToSend() ?: ByteArray(0)).toRequestBody(),
            )
        }

        request.headers().forEach { (name, values) ->
            if (values.size == 1) {
                builder.header(name, values[0])
            } else {
                builder.removeHeader(name)
                values.forEach { builder.addHeader(name, it) }
            }
        }
        if (request.headers()["User-Agent"].isNullOrEmpty()) {
            builder.header(
                "User-Agent",
                "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) " +
                    "Chrome/120.0.0.0 Mobile Safari/537.36",
            )
        }

        client.newCall(builder.build()).execute().use { response ->
            if (response.code == 429) {
                throw IOException("Rate limited (429) fetching ${request.url()}")
            }
            return NewPipeResponse(
                response.code,
                response.message,
                response.headers.toMultimap(),
                response.body?.string(),
                response.request.url.toString(),
            )
        }
    }
}

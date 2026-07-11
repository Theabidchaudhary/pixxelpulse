package com.orwyx.player

import android.app.Application
import android.os.Build
import coil.ImageLoader
import coil.ImageLoaderFactory
import coil.decode.VideoFrameDecoder
import coil.disk.DiskCache
import coil.memory.MemoryCache
import coil.request.CachePolicy
import com.orwyx.player.data.scanner.MediaChangeObserver
import com.orwyx.player.data.scanner.MediaScanner
import dagger.hilt.android.HiltAndroidApp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import javax.inject.Inject

/**
 * Application entry point.
 *
 * Configures Coil for efficient video-frame thumbnails:
 *  - small memory cache (thumbnails only, capped as a fraction of the heap),
 *  - persistent disk cache so re-scrolling a 100k-item library never re-decodes frames,
 *  - hardware bitmaps where safe to halve memory per thumbnail.
 *
 * Also starts [MediaChangeObserver] for the lifetime of the process, so the
 * library updates itself the moment a video is added or removed anywhere on
 * the device — the app never needs to rescan just because it was reopened.
 */
@HiltAndroidApp
class OrwyxApplication : Application(), ImageLoaderFactory {

    @Inject lateinit var mediaScanner: MediaScanner

    private val processScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    override fun onCreate() {
        super.onCreate()
        MediaChangeObserver(this, mediaScanner, processScope).start()
    }

    override fun newImageLoader(): ImageLoader =
        ImageLoader.Builder(this)
            .components { add(VideoFrameDecoder.Factory()) }
            .memoryCache {
                MemoryCache.Builder(this)
                    .maxSizePercent(0.15)
                    .build()
            }
            .diskCache {
                DiskCache.Builder()
                    .directory(cacheDir.resolve("video_thumbs"))
                    .maxSizeBytes(256L * 1024 * 1024)
                    .build()
            }
            .memoryCachePolicy(CachePolicy.ENABLED)
            .diskCachePolicy(CachePolicy.ENABLED)
            .allowHardware(Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q)
            .crossfade(150)
            .respectCacheHeaders(false)
            .build()
}

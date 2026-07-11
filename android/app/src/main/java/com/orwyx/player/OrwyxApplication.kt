package com.orwyx.player

import android.app.Application
import android.os.Build
import coil.ImageLoader
import coil.ImageLoaderFactory
import coil.decode.VideoFrameDecoder
import coil.disk.DiskCache
import coil.memory.MemoryCache
import coil.request.CachePolicy
import dagger.hilt.android.HiltAndroidApp

/**
 * Application entry point.
 *
 * Configures Coil for efficient video-frame thumbnails:
 *  - small memory cache (thumbnails only, capped as a fraction of the heap),
 *  - persistent disk cache so re-scrolling a 100k-item library never re-decodes frames,
 *  - hardware bitmaps where safe to halve memory per thumbnail.
 */
@HiltAndroidApp
class OrwyxApplication : Application(), ImageLoaderFactory {

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

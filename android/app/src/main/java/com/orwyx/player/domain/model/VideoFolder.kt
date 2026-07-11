package com.orwyx.player.domain.model

/** A folder in the library, aggregated from the videos it contains. */
data class VideoFolder(
    val path: String,
    val name: String,
    val videoCount: Int,
    val totalSizeBytes: Long,
    val latestDateAddedMs: Long,
    val isHidden: Boolean = false,
)

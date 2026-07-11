package com.orwyx.player.data.db

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import com.orwyx.player.domain.model.HdrType
import com.orwyx.player.domain.model.Video

/**
 * Persistent record for every indexed video.
 *
 * Indexes back every sort key and hot filter so listing queries stay index-backed
 * on six-figure libraries.
 */
@Entity(
    tableName = "videos",
    indices = [
        Index("uri", unique = true),
        Index("folderPath"),
        Index("title"),
        Index("dateAddedMs"),
        Index("lastPlayedAtMs"),
        Index("sizeBytes"),
        Index("durationMs"),
        Index("heightPx"),
        Index("frameRate"),
        Index("isFavorite"),
        Index("isPrivate"),
    ],
)
data class VideoEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val uri: String,
    val path: String,
    val title: String,
    val folderPath: String,
    val folderName: String,
    val sizeBytes: Long,
    val durationMs: Long,
    @ColumnInfo(name = "widthPx") val width: Int,
    @ColumnInfo(name = "heightPx") val height: Int,
    val frameRate: Float,
    val bitrate: Long,
    val videoCodec: String?,
    val audioCodec: String?,
    val hdrType: HdrType,
    /** Whether the slow MediaExtractor pass (codec/fps/HDR) ran for this row yet. */
    val metadataResolved: Boolean,
    val dateAddedMs: Long,
    val dateModifiedMs: Long,
    val lastPlayedAtMs: Long = 0,
    val positionMs: Long = 0,
    val isFavorite: Boolean = false,
    val isPrivate: Boolean = false,
    /** Rows missing from the latest scan are marked stale, then swept. */
    val presentInLastScan: Boolean = true,
)

fun VideoEntity.toDomain() = Video(
    id = id,
    uri = uri,
    path = path,
    title = title,
    folderPath = folderPath,
    folderName = folderName,
    sizeBytes = sizeBytes,
    durationMs = durationMs,
    width = width,
    height = height,
    frameRate = frameRate,
    bitrate = bitrate,
    videoCodec = videoCodec,
    audioCodec = audioCodec,
    hdrType = hdrType,
    dateAddedMs = dateAddedMs,
    dateModifiedMs = dateModifiedMs,
    lastPlayedAtMs = lastPlayedAtMs,
    positionMs = positionMs,
    isFavorite = isFavorite,
    isPrivate = isPrivate,
)

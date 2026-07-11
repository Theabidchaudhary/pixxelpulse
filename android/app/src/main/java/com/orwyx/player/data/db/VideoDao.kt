package com.orwyx.player.data.db

import androidx.paging.PagingSource
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.RawQuery
import androidx.room.Update
import androidx.sqlite.db.SupportSQLiteQuery
import kotlinx.coroutines.flow.Flow

@Dao
interface VideoDao {

    /** Paged listing driven by [LibraryQueryBuilder]; scales to very large libraries. */
    @RawQuery(observedEntities = [VideoEntity::class])
    fun paged(query: SupportSQLiteQuery): PagingSource<Int, VideoEntity>

    @RawQuery(observedEntities = [VideoEntity::class])
    fun observe(query: SupportSQLiteQuery): Flow<List<VideoEntity>>

    @Query("SELECT * FROM videos WHERE id = :id")
    suspend fun byId(id: Long): VideoEntity?

    @Query("SELECT * FROM videos WHERE uri = :uri")
    suspend fun byUri(uri: String): VideoEntity?

    @Query(
        """SELECT * FROM videos
           WHERE presentInLastScan = 1 AND isPrivate = 0
             AND positionMs > 5000 AND positionMs < durationMs * 0.98
           ORDER BY lastPlayedAtMs DESC LIMIT :limit""",
    )
    fun continueWatching(limit: Int): Flow<List<VideoEntity>>

    @Query(
        """SELECT folderPath AS path,
                  folderName AS name,
                  COUNT(*) AS videoCount,
                  SUM(sizeBytes) AS totalSizeBytes,
                  MAX(dateAddedMs) AS latestDateAddedMs
           FROM videos
           WHERE presentInLastScan = 1 AND isPrivate = 0
           GROUP BY folderPath
           ORDER BY name COLLATE NOCASE ASC""",
    )
    fun folders(): Flow<List<FolderAggregate>>

    // --- Scan bookkeeping -------------------------------------------------

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(videos: List<VideoEntity>): List<Long>

    @Update
    suspend fun update(video: VideoEntity)

    @Query("UPDATE videos SET presentInLastScan = 0")
    suspend fun markAllStale()

    @Query(
        """UPDATE videos SET presentInLastScan = 1, sizeBytes = :sizeBytes,
           dateModifiedMs = :dateModifiedMs, title = :title, path = :path,
           folderPath = :folderPath, folderName = :folderName
           WHERE uri = :uri""",
    )
    suspend fun refreshSeen(
        uri: String,
        sizeBytes: Long,
        dateModifiedMs: Long,
        title: String,
        path: String,
        folderPath: String,
        folderName: String,
    ): Int

    @Query("DELETE FROM videos WHERE presentInLastScan = 0")
    suspend fun sweepStale(): Int

    @Query("DELETE FROM videos WHERE id = :id")
    suspend fun delete(id: Long)

    // --- Lazy metadata enrichment ----------------------------------------

    @Query("SELECT * FROM videos WHERE metadataResolved = 0 AND presentInLastScan = 1 LIMIT :limit")
    suspend fun needingMetadata(limit: Int): List<VideoEntity>

    @Query(
        """UPDATE videos SET widthPx = :width, heightPx = :height, frameRate = :frameRate,
           bitrate = :bitrate, videoCodec = :videoCodec, audioCodec = :audioCodec,
           hdrType = :hdrType, durationMs = :durationMs, metadataResolved = 1
           WHERE id = :id""",
    )
    suspend fun applyMetadata(
        id: Long,
        width: Int,
        height: Int,
        frameRate: Float,
        bitrate: Long,
        videoCodec: String?,
        audioCodec: String?,
        hdrType: String,
        durationMs: Long,
    )

    // --- Playback state ----------------------------------------------------

    @Query("UPDATE videos SET positionMs = :positionMs, lastPlayedAtMs = :playedAtMs WHERE id = :id")
    suspend fun savePlaybackPosition(id: Long, positionMs: Long, playedAtMs: Long)

    @Query("UPDATE videos SET isFavorite = :favorite WHERE id = :id")
    suspend fun setFavorite(id: Long, favorite: Boolean)

    @Query("UPDATE videos SET isPrivate = :private WHERE id = :id")
    suspend fun setPrivate(id: Long, private: Boolean)

    @Query("UPDATE videos SET title = :title, path = :path WHERE id = :id")
    suspend fun applyRename(id: Long, title: String, path: String)
}

/** Projection for the folder listing. */
data class FolderAggregate(
    val path: String,
    val name: String,
    val videoCount: Int,
    val totalSizeBytes: Long,
    val latestDateAddedMs: Long,
)

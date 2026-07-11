package com.orwyx.player.data.repository

import androidx.paging.Pager
import androidx.paging.PagingConfig
import androidx.paging.PagingData
import androidx.paging.map
import com.orwyx.player.data.db.LibraryQueryBuilder
import com.orwyx.player.data.db.VideoDao
import com.orwyx.player.data.db.toDomain
import com.orwyx.player.data.settings.SettingsRepository
import com.orwyx.player.domain.model.LibraryQuery
import com.orwyx.player.domain.model.Video
import com.orwyx.player.domain.model.VideoFolder
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Single source of truth for library reads and playback-state writes.
 * The UI never touches Room or MediaStore directly.
 */
@OptIn(ExperimentalCoroutinesApi::class)
@Singleton
class VideoRepository @Inject constructor(
    private val dao: VideoDao,
    private val settings: SettingsRepository,
) {
    private val hiddenFolderSets: Flow<Set<String>> =
        settings.settings.map { it.hiddenFolders }.distinctUntilChanged()

    /** Paged, DB-sorted listing for the main grid; scales to 100k+ rows. */
    fun pagedVideos(query: LibraryQuery): Flow<PagingData<Video>> =
        hiddenFolderSets.flatMapLatest { hidden ->
            Pager(
                config = PagingConfig(pageSize = 60, prefetchDistance = 40, enablePlaceholders = false),
                pagingSourceFactory = { dao.paged(buildQuery(query, hidden)) },
            ).flow
        }.map { paging -> paging.map { it.toDomain() } }

    /** Non-paged listing used to build the playback queue for a context (e.g. one folder). */
    fun videos(query: LibraryQuery): Flow<List<Video>> =
        hiddenFolderSets
            .flatMapLatest { hidden -> dao.observe(buildQuery(query, hidden)) }
            .map { list -> list.map { it.toDomain() } }

    val continueWatching: Flow<List<Video>> =
        dao.continueWatching(limit = 12).map { list -> list.map { it.toDomain() } }

    val folders: Flow<List<VideoFolder>> =
        combine(dao.folders(), settings.settings) { aggregates, prefs ->
            aggregates.map { agg ->
                VideoFolder(
                    path = agg.path,
                    name = agg.name,
                    videoCount = agg.videoCount,
                    totalSizeBytes = agg.totalSizeBytes,
                    latestDateAddedMs = agg.latestDateAddedMs,
                    isHidden = agg.path in prefs.hiddenFolders,
                )
            }.filter { !it.isHidden }
        }

    val hiddenFolders: Flow<List<VideoFolder>> =
        combine(dao.folders(), settings.settings) { aggregates, prefs ->
            aggregates
                .filter { it.path in prefs.hiddenFolders }
                .map {
                    VideoFolder(it.path, it.name, it.videoCount, it.totalSizeBytes, it.latestDateAddedMs, true)
                }
        }

    suspend fun video(id: Long): Video? = dao.byId(id)?.toDomain()

    suspend fun savePlaybackPosition(id: Long, positionMs: Long) =
        dao.savePlaybackPosition(id, positionMs, System.currentTimeMillis())

    suspend fun setFavorite(id: Long, favorite: Boolean) = dao.setFavorite(id, favorite)

    suspend fun setPrivate(id: Long, private: Boolean) = dao.setPrivate(id, private)

    private fun buildQuery(query: LibraryQuery, hidden: Set<String>) =
        LibraryQueryBuilder.build(query, hidden, System.currentTimeMillis())
}

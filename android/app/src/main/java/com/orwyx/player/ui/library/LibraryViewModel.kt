package com.orwyx.player.ui.library

import android.content.Intent
import android.content.IntentSender
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.paging.PagingData
import androidx.paging.cachedIn
import com.orwyx.player.data.files.FileOpResult
import com.orwyx.player.data.files.FileOperations
import com.orwyx.player.data.repository.VideoRepository
import com.orwyx.player.data.scanner.MediaScanner
import com.orwyx.player.data.scanner.ScanState
import com.orwyx.player.data.settings.SettingsRepository
import com.orwyx.player.domain.model.LibraryQuery
import com.orwyx.player.domain.model.SortBy
import com.orwyx.player.domain.model.SortDirection
import com.orwyx.player.domain.model.Video
import com.orwyx.player.domain.model.VideoFolder
import com.orwyx.player.domain.model.VideoFilter
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

/** One-shot UI events the screen must act on. */
sealed interface LibraryEvent {
    /** Launch the system consent dialog, then call [LibraryViewModel.onConsentGranted]. */
    data class RequestConsent(val sender: IntentSender, val pendingAction: PendingAction) : LibraryEvent
    data class LaunchShare(val intent: Intent) : LibraryEvent
    data class Message(val text: String) : LibraryEvent
}

sealed interface PendingAction {
    data class Delete(val videoId: Long) : PendingAction
    data class Rename(val videoId: Long, val newTitle: String) : PendingAction
}

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class LibraryViewModel @Inject constructor(
    private val repository: VideoRepository,
    private val scanner: MediaScanner,
    private val fileOperations: FileOperations,
    private val settingsRepository: SettingsRepository,
) : ViewModel() {

    private val _query = MutableStateFlow(LibraryQuery())
    val query: StateFlow<LibraryQuery> = _query

    val videos: Flow<PagingData<Video>> = _query
        .flatMapLatest { repository.pagedVideos(it) }
        .cachedIn(viewModelScope)

    val folders: StateFlow<List<VideoFolder>> = repository.folders
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    val continueWatching: StateFlow<List<Video>> = repository.continueWatching
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    val scanState: StateFlow<ScanState> = scanner.state

    private val _events = Channel<LibraryEvent>(Channel.BUFFERED)
    val events: Flow<LibraryEvent> = _events.receiveAsFlow()

    /** Kicks a scan once permission is granted (and again on manual pull-to-refresh). */
    fun scan(force: Boolean = false) {
        viewModelScope.launch {
            val auto = settingsRepository.settings.first().autoScan
            if (auto || force) scanner.scan()
        }
    }

    // --- Query mutations ------------------------------------------------------

    fun setSearch(text: String) = update { it.copy(search = text) }
    fun setFilter(filter: VideoFilter) = update { it.copy(filter = filter) }
    fun setFolder(path: String?) = update { it.copy(folderPath = path) }

    /** Vault screens flip the query into private-only mode after authentication. */
    fun setVaultMode(enabled: Boolean) = update { it.copy(includePrivate = enabled) }

    fun setSort(sortBy: SortBy, direction: SortDirection) =
        update { it.copy(sortBy = sortBy, direction = direction) }

    private fun update(block: (LibraryQuery) -> LibraryQuery) {
        _query.value = block(_query.value)
    }

    // --- Item actions -----------------------------------------------------------

    fun toggleFavorite(video: Video) {
        viewModelScope.launch { repository.setFavorite(video.id, !video.isFavorite) }
    }

    fun moveToPrivate(video: Video, private: Boolean) {
        viewModelScope.launch { repository.setPrivate(video.id, private) }
    }

    fun hideFolder(path: String) {
        viewModelScope.launch { settingsRepository.toggleHiddenFolder(path) }
    }

    fun share(video: Video) {
        viewModelScope.launch {
            _events.send(LibraryEvent.LaunchShare(fileOperations.shareIntent(video.uri)))
        }
    }

    fun delete(video: Video) {
        viewModelScope.launch {
            when (val result = fileOperations.delete(video.id)) {
                is FileOpResult.Success -> _events.send(LibraryEvent.Message("Deleted"))
                is FileOpResult.NeedsConsent -> _events.send(
                    LibraryEvent.RequestConsent(result.intentSender, PendingAction.Delete(video.id)),
                )
                is FileOpResult.Failure -> _events.send(LibraryEvent.Message(result.message))
            }
        }
    }

    fun rename(video: Video, newTitle: String) {
        viewModelScope.launch {
            when (val result = fileOperations.rename(video.id, newTitle)) {
                is FileOpResult.Success -> _events.send(LibraryEvent.Message("Renamed"))
                is FileOpResult.NeedsConsent -> _events.send(
                    LibraryEvent.RequestConsent(
                        result.intentSender,
                        PendingAction.Rename(video.id, newTitle),
                    ),
                )
                is FileOpResult.Failure -> _events.send(LibraryEvent.Message(result.message))
            }
        }
    }

    /** Completes the pending mutation after the system consent dialog returns OK. */
    fun onConsentGranted(action: PendingAction) {
        viewModelScope.launch {
            when (action) {
                is PendingAction.Delete -> {
                    fileOperations.confirmDeleted(action.videoId)
                    _events.send(LibraryEvent.Message("Deleted"))
                }
                is PendingAction.Rename -> {
                    fileOperations.confirmRename(action.videoId, action.newTitle)
                    _events.send(LibraryEvent.Message("Renamed"))
                }
            }
        }
    }

    fun addSafFolder(treeUri: String) {
        viewModelScope.launch {
            settingsRepository.addSafFolder(treeUri)
            scanner.scan()
        }
    }
}

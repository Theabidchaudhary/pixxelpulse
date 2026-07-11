package com.orwyx.player.ui.library

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CreateNewFolder
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.SortByAlpha
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.paging.compose.collectAsLazyPagingItems
import com.orwyx.player.data.scanner.ScanState
import com.orwyx.player.ui.components.EmptyState
import com.orwyx.player.ui.components.FilterChipRow
import com.orwyx.player.ui.components.FolderCard
import com.orwyx.player.ui.components.SortSheet
import com.orwyx.player.ui.components.VideoCard
import com.orwyx.player.ui.player.PlayerActivity

private val MEDIA_PERMISSION =
    if (Build.VERSION.SDK_INT >= 33) Manifest.permission.READ_MEDIA_VIDEO
    else Manifest.permission.READ_EXTERNAL_STORAGE

/**
 * Library home: Videos and Folders tabs, instant search, quick filters, sort
 * sheet, continue-watching rail, scan progress, and entry points to the
 * private vault and settings.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onOpenFolder: (String) -> Unit,
    onOpenVault: () -> Unit,
    onOpenSettings: () -> Unit,
    viewModel: LibraryViewModel = hiltViewModel(),
) {
    val context = LocalContext.current
    val snackbar = remember { SnackbarHostState() }
    var hasPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, MEDIA_PERMISSION) ==
                PackageManager.PERMISSION_GRANTED,
        )
    }
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        hasPermission = granted
        if (granted) viewModel.scan()
    }
    val safLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.OpenDocumentTree(),
    ) { uri ->
        uri ?: return@rememberLauncherForActivityResult
        context.contentResolver.takePersistableUriPermission(
            uri,
            android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION,
        )
        viewModel.addSafFolder(uri.toString())
    }

    LaunchedEffect(hasPermission) { if (hasPermission) viewModel.scan() }
    LibraryEventHandler(viewModel, snackbar)

    val query by viewModel.query.collectAsState()
    val scanState by viewModel.scanState.collectAsState()
    val continueWatching by viewModel.continueWatching.collectAsState()
    val folders by viewModel.folders.collectAsState()
    val videos = viewModel.videos.collectAsLazyPagingItems()

    var tab by rememberSaveable { mutableIntStateOf(0) }
    var searching by rememberSaveable { mutableStateOf(false) }
    var showSort by rememberSaveable { mutableStateOf(false) }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbar) },
        topBar = {
            TopAppBar(
                title = {
                    if (searching) {
                        OutlinedTextField(
                            value = query.search,
                            onValueChange = viewModel::setSearch,
                            placeholder = { Text("Search your videos") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth(),
                        )
                    } else {
                        Text("Orwyx", style = MaterialTheme.typography.titleLarge)
                    }
                },
                actions = {
                    IconButton(onClick = {
                        if (searching) viewModel.setSearch("")
                        searching = !searching
                    }) { Icon(Icons.Filled.Search, "Search") }
                    IconButton(onClick = { showSort = true }) {
                        Icon(Icons.Filled.SortByAlpha, "Sort")
                    }
                    IconButton(onClick = { safLauncher.launch(null) }) {
                        Icon(Icons.Filled.CreateNewFolder, "Add folder")
                    }
                    IconButton(onClick = { viewModel.scan(force = true) }) {
                        Icon(Icons.Filled.Refresh, "Rescan")
                    }
                    IconButton(onClick = onOpenVault) { Icon(Icons.Filled.Lock, "Private folder") }
                    IconButton(onClick = onOpenSettings) { Icon(Icons.Filled.Settings, "Settings") }
                },
            )
        },
    ) { padding ->
        Column(Modifier.padding(padding)) {
            if (!hasPermission) {
                EmptyState(
                    title = "No videos yet",
                    body = "Grant media access or add a folder to build your library.",
                    actionLabel = "Grant access",
                    onAction = { permissionLauncher.launch(MEDIA_PERMISSION) },
                )
                return@Column
            }

            (scanState as? ScanState.Scanning)?.let {
                LinearProgressIndicator(Modifier.fillMaxWidth())
            }

            TabRow(selectedTabIndex = tab) {
                Tab(selected = tab == 0, onClick = { tab = 0 }, text = { Text("Videos") })
                Tab(selected = tab == 1, onClick = { tab = 1 }, text = { Text("Folders") })
            }

            if (tab == 0) {
                if (continueWatching.isNotEmpty() && query.search.isBlank()) {
                    Text(
                        "Continue watching",
                        style = MaterialTheme.typography.titleMedium,
                        modifier = Modifier.padding(start = 16.dp, top = 12.dp, bottom = 4.dp),
                    )
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp),
                    ) {
                        items(continueWatching, key = { it.id }) { video ->
                            Row(Modifier.width(220.dp)) {
                                VideoCard(
                                    video = video,
                                    onClick = {
                                        context.startActivity(PlayerActivity.intent(context, video.id))
                                    },
                                    onLongClick = {},
                                )
                            }
                        }
                    }
                }

                FilterChipRow(
                    selected = query.filter,
                    onSelect = viewModel::setFilter,
                    modifier = Modifier.padding(vertical = 8.dp),
                )

                if (videos.itemCount == 0 && scanState is ScanState.Idle) {
                    EmptyState(
                        title = "Nothing here",
                        body = "No videos match this view. Try another filter or rescan.",
                        actionLabel = "Rescan library",
                        onAction = { viewModel.scan(force = true) },
                    )
                } else {
                    VideoGrid(
                        items = videos,
                        viewModel = viewModel,
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                    )
                }
            } else {
                if (folders.isEmpty()) {
                    EmptyState(title = "No folders", body = "Folders appear once videos are indexed.")
                } else {
                    LazyColumn(Modifier.fillMaxSize()) {
                        items(folders, key = { it.path }) { folder ->
                            FolderCard(
                                folder = folder,
                                onClick = { onOpenFolder(folder.path) },
                                onLongClick = { viewModel.hideFolder(folder.path) },
                            )
                        }
                    }
                }
            }
        }
    }

    if (showSort) {
        SortSheet(
            query = query,
            onDismiss = { showSort = false },
            onSelect = { sortBy, direction -> viewModel.setSort(sortBy, direction) },
        )
    }
}

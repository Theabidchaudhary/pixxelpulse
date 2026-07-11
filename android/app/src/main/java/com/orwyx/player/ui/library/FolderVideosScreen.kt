package com.orwyx.player.ui.library

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.paging.compose.collectAsLazyPagingItems
import java.io.File

/** All videos inside one folder, with the same grid, sorting, and actions as Home. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FolderVideosScreen(
    folderPath: String,
    onBack: () -> Unit,
    viewModel: LibraryViewModel = hiltViewModel(),
) {
    val snackbar = remember { SnackbarHostState() }
    LibraryEventHandler(viewModel, snackbar)

    LaunchedEffect(folderPath) {
        viewModel.setFolder(folderPath)
    }
    val videos = viewModel.videos.collectAsLazyPagingItems()

    Scaffold(
        snackbarHost = { SnackbarHost(snackbar) },
        topBar = {
            TopAppBar(
                title = { Text(File(folderPath).name) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back")
                    }
                },
            )
        },
    ) { padding ->
        Column(Modifier.padding(padding)) {
            VideoGrid(
                items = videos,
                viewModel = viewModel,
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
            )
        }
    }
}

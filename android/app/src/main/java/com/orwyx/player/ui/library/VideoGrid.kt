package com.orwyx.player.ui.library

import android.app.Activity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyGridScope
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.paging.compose.LazyPagingItems
import com.orwyx.player.core.util.Formatters
import com.orwyx.player.domain.model.Video
import com.orwyx.player.ui.components.VideoCard
import com.orwyx.player.ui.player.PlayerActivity

/**
 * Shared paged grid + long-press actions used by Home, folder, and vault screens.
 * Adaptive cells give phones 2 columns and tablets/foldables as many as fit.
 */
@Composable
fun VideoGrid(
    items: LazyPagingItems<Video>,
    viewModel: LibraryViewModel,
    contentPadding: PaddingValues,
    modifier: Modifier = Modifier,
    inVault: Boolean = false,
) {
    val context = LocalContext.current
    var actionsFor by remember { mutableStateOf<Video?>(null) }

    LazyVerticalGrid(
        columns = GridCells.Adaptive(minSize = 168.dp),
        contentPadding = contentPadding,
        modifier = modifier.fillMaxSize(),
    ) {
        gridItems(items) { video ->
            VideoCard(
                video = video,
                onClick = { context.startActivity(PlayerActivity.intent(context, video.id)) },
                onLongClick = { actionsFor = video },
            )
        }
    }

    actionsFor?.let { video ->
        VideoActionsSheet(
            video = video,
            viewModel = viewModel,
            inVault = inVault,
            onDismiss = { actionsFor = null },
        )
    }
}

private fun LazyGridScope.gridItems(
    items: LazyPagingItems<Video>,
    itemContent: @Composable (Video) -> Unit,
) {
    items(
        count = items.itemCount,
        key = { index -> items.peek(index)?.id ?: index },
    ) { index ->
        items[index]?.let { itemContent(it) }
    }
}

/** Long-press actions: play, favorite, private, rename, share, delete, properties. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VideoActionsSheet(
    video: Video,
    viewModel: LibraryViewModel,
    inVault: Boolean,
    onDismiss: () -> Unit,
) {
    val context = LocalContext.current
    var renaming by rememberSaveable { mutableStateOf(false) }
    var deleting by rememberSaveable { mutableStateOf(false) }
    var showProperties by rememberSaveable { mutableStateOf(false) }

    ModalBottomSheet(onDismissRequest = onDismiss) {
        ListItem(
            headlineContent = { Text(video.title, style = MaterialTheme.typography.titleMedium) },
            supportingContent = { Text(video.folderName) },
        )
        SheetAction("Play") {
            context.startActivity(PlayerActivity.intent(context, video.id))
            onDismiss()
        }
        SheetAction(if (video.isFavorite) "Remove favorite" else "Favorite") {
            viewModel.toggleFavorite(video)
            onDismiss()
        }
        SheetAction(if (inVault) "Remove from private folder" else "Move to private folder") {
            viewModel.moveToPrivate(video, !inVault)
            onDismiss()
        }
        SheetAction("Rename") { renaming = true }
        SheetAction("Share") {
            viewModel.share(video)
            onDismiss()
        }
        SheetAction("Properties") { showProperties = true }
        SheetAction("Delete", destructive = true) { deleting = true }
    }

    if (renaming) {
        var name by rememberSaveable { mutableStateOf(video.title) }
        AlertDialog(
            onDismissRequest = { renaming = false },
            title = { Text("Rename video") },
            text = {
                OutlinedTextField(value = name, onValueChange = { name = it }, singleLine = true)
            },
            confirmButton = {
                TextButton(onClick = {
                    viewModel.rename(video, name)
                    renaming = false
                    onDismiss()
                }) { Text("Rename") }
            },
            dismissButton = { TextButton(onClick = { renaming = false }) { Text("Cancel") } },
        )
    }

    if (deleting) {
        AlertDialog(
            onDismissRequest = { deleting = false },
            title = { Text("Delete video?") },
            text = { Text("This permanently deletes \"${video.title}\" from your device.") },
            confirmButton = {
                TextButton(onClick = {
                    viewModel.delete(video)
                    deleting = false
                    onDismiss()
                }) { Text("Delete") }
            },
            dismissButton = { TextButton(onClick = { deleting = false }) { Text("Cancel") } },
        )
    }

    if (showProperties) {
        AlertDialog(
            onDismissRequest = { showProperties = false },
            title = { Text(video.title) },
            text = {
                Text(
                    buildString {
                        appendLine("Path: ${video.path}")
                        appendLine("Size: ${Formatters.fileSize(video.sizeBytes)}")
                        appendLine("Duration: ${Formatters.duration(video.durationMs)}")
                        appendLine("Resolution: ${Formatters.resolution(video.width, video.height)}")
                        video.videoCodec?.let { appendLine("Video codec: $it") }
                        video.audioCodec?.let { appendLine("Audio codec: $it") }
                        Formatters.frameRate(video.frameRate)?.let { appendLine("Frame rate: $it") }
                        video.hdrType.badge?.let { appendLine("HDR: $it") }
                    },
                )
            },
            confirmButton = {
                TextButton(onClick = { showProperties = false }) { Text("Close") }
            },
        )
    }
}

@Composable
private fun SheetAction(label: String, destructive: Boolean = false, onClick: () -> Unit) {
    ListItem(
        headlineContent = {
            Text(
                label,
                color = if (destructive) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface,
            )
        },
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
    )
}

/** One place to hook the consent + share event stream from [LibraryViewModel]. */
@Composable
fun LibraryEventHandler(viewModel: LibraryViewModel, snackbar: SnackbarHostState) {
    val context = LocalContext.current
    var pending by remember { mutableStateOf<PendingAction?>(null) }
    val consentLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.StartIntentSenderForResult(),
    ) { result ->
        val action = pending
        pending = null
        if (result.resultCode == Activity.RESULT_OK && action != null) {
            viewModel.onConsentGranted(action)
        }
    }

    LaunchedEffect(viewModel) {
        viewModel.events.collect { event ->
            when (event) {
                is LibraryEvent.RequestConsent -> {
                    pending = event.pendingAction
                    consentLauncher.launch(IntentSenderRequest.Builder(event.sender).build())
                }
                is LibraryEvent.LaunchShare -> context.startActivity(event.intent)
                is LibraryEvent.Message -> snackbar.showSnackbar(event.text)
            }
        }
    }
}

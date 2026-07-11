package com.orwyx.player.ui.components

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.orwyx.player.domain.model.LibraryQuery
import com.orwyx.player.domain.model.SortBy
import com.orwyx.player.domain.model.SortDirection
import com.orwyx.player.domain.model.VideoFilter

/** Quick filter chip row shown above the grid. */
@Composable
fun FilterChipRow(
    selected: VideoFilter,
    onSelect: (VideoFilter) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 16.dp),
    ) {
        VideoFilter.entries.forEach { filter ->
            FilterChip(
                selected = selected == filter,
                onClick = { onSelect(filter) },
                label = { Text(filter.label) },
            )
        }
    }
}

/** Sort sheet: one chip per key plus an ascending/descending toggle. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SortSheet(
    query: LibraryQuery,
    onDismiss: () -> Unit,
    onSelect: (SortBy, SortDirection) -> Unit,
) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Sort by", style = MaterialTheme.typography.titleLarge, modifier = Modifier.weight(1f))
                IconButton(onClick = {
                    val next = if (query.direction == SortDirection.ASCENDING) {
                        SortDirection.DESCENDING
                    } else {
                        SortDirection.ASCENDING
                    }
                    onSelect(query.sortBy, next)
                }) {
                    Icon(
                        if (query.direction == SortDirection.ASCENDING) {
                            Icons.Filled.ArrowUpward
                        } else {
                            Icons.Filled.ArrowDownward
                        },
                        contentDescription = "Toggle direction",
                    )
                }
            }
            Spacer(Modifier.height(8.dp))
            SortBy.entries.chunked(3).forEach { rowItems ->
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    rowItems.forEach { sort ->
                        FilterChip(
                            selected = query.sortBy == sort,
                            onClick = { onSelect(sort, query.direction) },
                            label = { Text(sort.label) },
                        )
                    }
                }
            }
            Spacer(Modifier.height(24.dp))
        }
    }
}

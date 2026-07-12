package com.orwyx.unitcalculator.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.orwyx.unitcalculator.domain.model.DayPlan
import com.orwyx.unitcalculator.ui.theme.ConsumptionColors
import java.time.DayOfWeek
import java.time.format.TextStyle
import java.util.Locale

/**
 * A month-style grid for the billing cycle. Each cell is tinted along the consumption gradient by
 * how much of the target is used by that day, with today outlined. Tapping a day surfaces its
 * expected/actual detail via [onDaySelected].
 */
@Composable
fun PlanningCalendar(
    days: List<DayPlan>,
    onDaySelected: (DayPlan) -> Unit,
    modifier: Modifier = Modifier,
) {
    if (days.isEmpty()) return
    val weekdayHeaders = listOf(
        DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY,
    )
    // Leading blanks so the first day lands under its weekday column (Monday-first).
    val leadingBlanks = (days.first().date.dayOfWeek.value + 6) % 7

    Column(modifier.fillMaxWidth()) {
        Row(Modifier.fillMaxWidth()) {
            weekdayHeaders.forEach { dow ->
                Text(
                    text = dow.getDisplayName(TextStyle.SHORT, Locale.getDefault()).take(1),
                    modifier = Modifier.weight(1f),
                    textAlign = TextAlign.Center,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        Spacer(Modifier.height(6.dp))

        val cells: List<DayPlan?> = List(leadingBlanks) { null } + days
        cells.chunked(7).forEach { week ->
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                week.forEach { day ->
                    Box(Modifier.weight(1f)) {
                        if (day != null) DayCell(day, onDaySelected)
                    }
                }
                // Pad short final week so cells keep their width.
                repeat(7 - week.size) { Box(Modifier.weight(1f)) {} }
            }
            Spacer(Modifier.height(4.dp))
        }
    }
}

@Composable
private fun DayCell(day: DayPlan, onDaySelected: (DayPlan) -> Unit) {
    val color = ConsumptionColors.colorFor(day.usedFraction)
    val alpha = if (day.isFuture) 0.28f else 0.85f
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(1f)
            .clip(RoundedCornerShape(10.dp))
            .background(color.copy(alpha = alpha * 0.35f))
            .then(
                if (day.isToday) Modifier.border(2.dp, color, RoundedCornerShape(10.dp))
                else Modifier,
            )
            .clickable { onDaySelected(day) },
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = day.date.dayOfMonth.toString(),
            style = MaterialTheme.typography.labelLarge,
            fontWeight = if (day.isToday) FontWeight.Bold else FontWeight.Medium,
            color = if (day.isFuture) MaterialTheme.colorScheme.onSurfaceVariant
            else MaterialTheme.colorScheme.onSurface,
        )
    }
}

/** Compact legend explaining the calendar's colour gradient. */
@Composable
fun CalendarLegend(modifier: Modifier = Modifier) {
    Row(modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Text(
            "Safe",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(0.dp))
        Box(
            Modifier
                .padding(horizontal = 8.dp)
                .weight(1f)
                .height(8.dp)
                .clip(RoundedCornerShape(4.dp))
                .background(
                    androidx.compose.ui.graphics.Brush.horizontalGradient(
                        (0..10).map { ConsumptionColors.colorFor(it / 10f) },
                    ),
                ),
        )
        Text(
            "Over",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

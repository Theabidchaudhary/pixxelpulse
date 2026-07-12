package com.orwyx.unitcalculator.ui.screens.meters

import com.orwyx.unitcalculator.domain.model.Meter

/** Sort options for the meter list, each with a display label and a comparator. */
enum class MeterSort(val label: String) {
    NAME("Name"),
    REMAINING("Remaining units"),
    HIGHEST_CONSUMPTION("Highest consumption"),
    DANGER_LEVEL("Danger level"),
    NEWEST("Newest"),
    OLDEST("Oldest");

    fun sort(meters: List<Meter>): List<Meter> = when (this) {
        NAME -> meters.sortedBy { it.name.lowercase() }
        REMAINING -> meters.sortedBy { it.remainingUnits }
        HIGHEST_CONSUMPTION -> meters.sortedByDescending { it.consumedUnits }
        DANGER_LEVEL -> meters.sortedByDescending { it.usedFraction }
        NEWEST -> meters.sortedByDescending { it.createdAt }
        OLDEST -> meters.sortedBy { it.createdAt }
    }
}

/** Filters meters by a query matched against name or reference number. */
fun List<Meter>.filterByQuery(query: String): List<Meter> {
    if (query.isBlank()) return this
    val q = query.trim().lowercase()
    return filter {
        it.name.lowercase().contains(q) || it.referenceNumber.contains(q)
    }
}

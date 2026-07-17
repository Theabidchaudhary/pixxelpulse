package com.orwyx.unitcalculator.domain.model

import java.time.LocalDate

data class Meter(
    val id: Long = 0L,
    val name: String,
    val referenceNumber: String,
    val providerId: String = ElectricityProvider.DEFAULT.id,
    val targetLimit: Double,
    val previousReading: Double,
    val currentReading: Double,
    val createdAt: Long = 0L,
    val updatedAt: Long = 0L,
    val closedDate: LocalDate? = null,
) {
    val provider: ElectricityProvider get() = ElectricityProvider.fromId(providerId)
    val consumedUnits: Double get() = (currentReading - previousReading).coerceAtLeast(0.0)
    val remainingUnits: Double get() = targetLimit - consumedUnits
    val usedFraction: Float get() = if (targetLimit <= 0.0) 0f else (consumedUnits / targetLimit).toFloat()
    val usedPercent: Float get() = usedFraction * 100f
    val status: MeterStatus get() = MeterStatus.fromPercent(usedFraction)
    val referenceLastFour: String get() = referenceNumber.takeLast(4).ifEmpty { referenceNumber }
}

package com.orwyx.unitcalculator.domain.model

/**
 * Domain representation of a single electricity meter. Consumption figures ([consumedUnits],
 * [remainingUnits], [usedFraction], [status]) are derived on demand rather than stored, so the
 * values can never drift out of sync with the readings.
 */
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
) {
    val provider: ElectricityProvider get() = ElectricityProvider.fromId(providerId)

    /** Consumed = current − previous, floored at zero to stay robust against bad input. */
    val consumedUnits: Double get() = (currentReading - previousReading).coerceAtLeast(0.0)

    /** Remaining = target − consumed. May be negative when the limit is exceeded. */
    val remainingUnits: Double get() = targetLimit - consumedUnits

    /** Fraction of the target consumed (0f..). 1f means exactly at the limit. */
    val usedFraction: Float
        get() = if (targetLimit <= 0.0) 0f else (consumedUnits / targetLimit).toFloat()

    val usedPercent: Float get() = usedFraction * 100f

    val status: MeterStatus get() = MeterStatus.fromPercent(usedFraction)

    /** Last four digits of the reference number, for the default masked display. */
    val referenceLastFour: String
        get() = referenceNumber.takeLast(4).ifEmpty { referenceNumber }
}

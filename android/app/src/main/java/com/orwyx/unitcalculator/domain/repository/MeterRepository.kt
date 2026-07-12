package com.orwyx.unitcalculator.domain.repository

import com.orwyx.unitcalculator.domain.model.Meter
import kotlinx.coroutines.flow.Flow

/** Single gateway to meter data. Implemented in the data layer over Room. */
interface MeterRepository {
    fun observeMeters(): Flow<List<Meter>>
    fun observeMeter(id: Long): Flow<Meter?>
    suspend fun getMeter(id: Long): Meter?
    suspend fun upsert(meter: Meter): Long
    suspend fun delete(id: Long)
    suspend fun count(): Int

    /** Resets a meter's month: current -> previous, current cleared, snapshotting to history. */
    suspend fun resetMonth(id: Long, monthLabel: String, avgDailyUsage: Double, closedAt: Long)
}

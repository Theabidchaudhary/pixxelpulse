package com.orwyx.unitcalculator.domain.repository

import com.orwyx.unitcalculator.domain.model.Meter
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate

interface MeterRepository {
    fun observeMeters(): Flow<List<Meter>>
    fun observeMeter(id: Long): Flow<Meter?>
    suspend fun getMeter(id: Long): Meter?
    suspend fun upsert(meter: Meter): Long
    suspend fun delete(id: Long)
    suspend fun count(): Int
    suspend fun resetMonth(id: Long, monthLabel: String, avgDailyUsage: Double, closedAt: Long)
    suspend fun setClosedDate(id: Long, closedDate: LocalDate?)
}

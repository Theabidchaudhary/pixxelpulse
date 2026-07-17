package com.orwyx.unitcalculator.data.repository

import androidx.room.withTransaction
import com.orwyx.unitcalculator.data.local.AppDatabase
import com.orwyx.unitcalculator.data.local.dao.HistoryDao
import com.orwyx.unitcalculator.data.local.dao.MeterDao
import com.orwyx.unitcalculator.data.local.entity.HistoryEntity
import com.orwyx.unitcalculator.data.mapper.toDomain
import com.orwyx.unitcalculator.data.mapper.toEntity
import com.orwyx.unitcalculator.domain.model.Meter
import com.orwyx.unitcalculator.domain.model.MeterStatus
import com.orwyx.unitcalculator.domain.repository.MeterRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.time.LocalDate
import javax.inject.Inject

class MeterRepositoryImpl @Inject constructor(
    private val db: AppDatabase,
    private val meterDao: MeterDao,
    private val historyDao: HistoryDao,
) : MeterRepository {

    override fun observeMeters(): Flow<List<Meter>> = meterDao.observeAll().map { list -> list.map { it.toDomain() } }
    override fun observeMeter(id: Long): Flow<Meter?> = meterDao.observeById(id).map { it?.toDomain() }
    override suspend fun getMeter(id: Long): Meter? = meterDao.getById(id)?.toDomain()

    override suspend fun upsert(meter: Meter): Long {
        val now = System.currentTimeMillis()
        return if (meter.id == 0L) {
            meterDao.insert(meter.copy(createdAt = now, updatedAt = now).toEntity())
        } else {
            meterDao.update(meter.copy(updatedAt = now).toEntity())
            meter.id
        }
    }

    override suspend fun delete(id: Long) = meterDao.deleteById(id)
    override suspend fun count(): Int = meterDao.count()

    override suspend fun resetMonth(id: Long, monthLabel: String, avgDailyUsage: Double, closedAt: Long) {
        db.withTransaction {
            val meter = meterDao.getById(id)?.toDomain() ?: return@withTransaction
            historyDao.insert(HistoryEntity(
                meterId = meter.id, monthLabel = monthLabel,
                previousReading = meter.previousReading, currentReading = meter.currentReading,
                unitsConsumed = meter.consumedUnits, target = meter.targetLimit,
                remaining = meter.remainingUnits, billAmount = null,
                avgDailyUsage = avgDailyUsage,
                status = meter.status.name.ifEmpty { MeterStatus.SAFE.name }, closedAt = closedAt,
            ))
            meterDao.update(meter.copy(
                previousReading = meter.currentReading, currentReading = meter.currentReading,
                closedDate = null, updatedAt = closedAt,
            ).toEntity())
        }
    }

    override suspend fun setClosedDate(id: Long, closedDate: LocalDate?) {
        val meter = meterDao.getById(id)?.toDomain() ?: return
        meterDao.update(meter.copy(closedDate = closedDate, updatedAt = System.currentTimeMillis()).toEntity())
    }
}

package com.orwyx.player.data.db

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.orwyx.player.domain.model.HdrType

@Database(
    entities = [VideoEntity::class],
    version = 1,
    exportSchema = false,
)
@TypeConverters(OrwyxTypeConverters::class)
abstract class OrwyxDatabase : RoomDatabase() {
    abstract fun videoDao(): VideoDao
}

class OrwyxTypeConverters {
    @TypeConverter
    fun hdrToString(value: HdrType): String = value.name

    @TypeConverter
    fun stringToHdr(value: String): HdrType =
        runCatching { HdrType.valueOf(value) }.getOrDefault(HdrType.NONE)
}

package com.orwyx.player.di

import android.content.Context
import androidx.room.Room
import com.orwyx.player.data.db.OrwyxDatabase
import com.orwyx.player.data.db.VideoDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): OrwyxDatabase =
        Room.databaseBuilder(context, OrwyxDatabase::class.java, "orwyx.db")
            .fallbackToDestructiveMigrationOnDowngrade()
            .build()

    @Provides
    fun provideVideoDao(db: OrwyxDatabase): VideoDao = db.videoDao()
}

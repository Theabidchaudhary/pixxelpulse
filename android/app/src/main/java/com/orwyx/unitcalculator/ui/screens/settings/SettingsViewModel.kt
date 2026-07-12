package com.orwyx.unitcalculator.ui.screens.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.orwyx.unitcalculator.domain.model.AppSettings
import com.orwyx.unitcalculator.domain.model.ThemeMode
import com.orwyx.unitcalculator.domain.repository.HistoryRepository
import com.orwyx.unitcalculator.domain.repository.SettingsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val settingsRepository: SettingsRepository,
    private val historyRepository: HistoryRepository,
) : ViewModel() {

    val settings: StateFlow<AppSettings> = settingsRepository.observeSettings()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), AppSettings())

    fun setTheme(mode: ThemeMode) = viewModelScope.launch { settingsRepository.setThemeMode(mode) }
    fun setReadingDate(day: Int) = viewModelScope.launch { settingsRepository.setReadingDate(day) }
    fun setDefaultTarget(target: Double) = viewModelScope.launch { settingsRepository.setDefaultTarget(target) }
    fun setAllowDecimals(allow: Boolean) = viewModelScope.launch { settingsRepository.setAllowDecimals(allow) }
    fun clearHistory() = viewModelScope.launch { historyRepository.clearAll() }
}

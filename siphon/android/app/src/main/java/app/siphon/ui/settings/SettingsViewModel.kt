package app.siphon.ui.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import app.siphon.data.settings.SiphonSettings
import app.siphon.data.settings.TargetDir
import app.siphon.data.settings.ThemeMode
import app.siphon.di.AppContainer
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class SettingsViewModel(private val container: AppContainer) : ViewModel() {

    val settings: StateFlow<SiphonSettings> = container.settings.settings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), SiphonSettings())

    fun setTheme(mode: ThemeMode) = viewModelScope.launch { container.settings.setTheme(mode) }

    fun setTargetDir(dir: TargetDir, customTreeUri: String? = null) =
        viewModelScope.launch { container.settings.setTargetDir(dir, customTreeUri) }

    fun setMaxParallel(count: Int) = viewModelScope.launch { container.settings.setMaxParallel(count) }

    fun setClipboardDetection(enabled: Boolean) =
        viewModelScope.launch { container.settings.setClipboardDetection(enabled) }

    fun setNotificationsEnabled(enabled: Boolean) =
        viewModelScope.launch { container.settings.setNotificationsEnabled(enabled) }

    fun setLanguageTag(tag: String) = viewModelScope.launch { container.settings.setLanguageTag(tag) }

    companion object {
        fun factory(container: AppContainer): ViewModelProvider.Factory = viewModelFactory {
            initializer { SettingsViewModel(container) }
        }
    }
}

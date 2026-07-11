package com.orwyx.player.ui.vault

import android.content.Context
import androidx.biometric.BiometricManager
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.orwyx.player.core.security.PinManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class VaultViewModel @Inject constructor(
    private val pinManager: PinManager,
) : ViewModel() {

    private val _unlocked = MutableStateFlow(false)
    val unlocked: StateFlow<Boolean> = _unlocked

    private val _pinConfigured = MutableStateFlow(true)
    val pinConfigured: StateFlow<Boolean> = _pinConfigured

    init {
        viewModelScope.launch { _pinConfigured.value = pinManager.isPinSet() }
    }

    fun tryUnlock(pin: String, onResult: (Boolean) -> Unit) {
        viewModelScope.launch {
            val ok = pinManager.verify(pin)
            if (ok) _unlocked.value = true
            onResult(ok)
        }
    }

    fun createPin(pin: String) {
        viewModelScope.launch {
            pinManager.setPin(pin)
            _pinConfigured.value = true
            _unlocked.value = true
        }
    }

    fun unlockViaBiometric() {
        _unlocked.value = true
    }

    fun lock() {
        _unlocked.value = false
    }

    fun biometricsAvailable(context: Context): Boolean =
        BiometricManager.from(context).canAuthenticate(
            BiometricManager.Authenticators.BIOMETRIC_WEAK,
        ) == BiometricManager.BIOMETRIC_SUCCESS
}

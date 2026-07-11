package com.orwyx.player.core.security

import com.orwyx.player.data.settings.SettingsRepository
import kotlinx.coroutines.flow.first
import java.security.SecureRandom
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Private-folder PIN handling. Stores only PBKDF2-HMAC-SHA256(pin, salt);
 * the PIN itself never touches disk, and backup rules exclude the store anyway.
 */
@Singleton
class PinManager @Inject constructor(
    private val settings: SettingsRepository,
) {
    suspend fun isPinSet(): Boolean = settings.settings.first().pinHash.isNotEmpty()

    suspend fun setPin(pin: String) {
        val salt = ByteArray(SALT_BYTES).also { SecureRandom().nextBytes(it) }
        settings.setPin(hash = derive(pin, salt), salt = salt.toHex())
    }

    suspend fun verify(pin: String): Boolean {
        val current = settings.settings.first()
        if (current.pinHash.isEmpty()) return false
        val computed = derive(pin, current.pinSalt.fromHex())
        return constantTimeEquals(computed, current.pinHash)
    }

    private fun derive(pin: String, salt: ByteArray): String {
        val spec = PBEKeySpec(pin.toCharArray(), salt, ITERATIONS, KEY_BITS)
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
        return factory.generateSecret(spec).encoded.toHex()
    }

    private fun constantTimeEquals(a: String, b: String): Boolean {
        if (a.length != b.length) return false
        var diff = 0
        for (i in a.indices) diff = diff or (a[i].code xor b[i].code)
        return diff == 0
    }

    private fun ByteArray.toHex() = joinToString("") { "%02x".format(it) }
    private fun String.fromHex() = chunked(2).map { it.toInt(16).toByte() }.toByteArray()

    private companion object {
        const val ITERATIONS = 120_000
        const val KEY_BITS = 256
        const val SALT_BYTES = 16
    }
}

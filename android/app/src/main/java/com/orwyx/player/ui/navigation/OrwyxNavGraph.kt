package com.orwyx.player.ui.navigation

import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.orwyx.player.ui.library.FolderVideosScreen
import com.orwyx.player.ui.library.HomeScreen
import com.orwyx.player.ui.settings.SettingsScreen
import com.orwyx.player.ui.vault.VaultScreen
import java.net.URLDecoder
import java.net.URLEncoder

object Routes {
    const val HOME = "home"
    const val FOLDER = "folder/{path}"
    const val VAULT = "vault"
    const val SETTINGS = "settings"

    fun folder(path: String): String = "folder/" + URLEncoder.encode(path, "UTF-8")
}

@Composable
fun OrwyxNavGraph() {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = Routes.HOME,
        enterTransition = { slideInHorizontally { it / 4 } + fadeIn() },
        exitTransition = { fadeOut() },
        popEnterTransition = { fadeIn() },
        popExitTransition = { slideOutHorizontally { it / 4 } + fadeOut() },
    ) {
        composable(Routes.HOME) {
            HomeScreen(
                onOpenFolder = { navController.navigate(Routes.folder(it)) },
                onOpenVault = { navController.navigate(Routes.VAULT) },
                onOpenSettings = { navController.navigate(Routes.SETTINGS) },
            )
        }
        composable(
            Routes.FOLDER,
            arguments = listOf(navArgument("path") { type = NavType.StringType }),
        ) { entry ->
            val encoded = entry.arguments?.getString("path").orEmpty()
            FolderVideosScreen(
                folderPath = URLDecoder.decode(encoded, "UTF-8"),
                onBack = { navController.popBackStack() },
            )
        }
        composable(Routes.VAULT) {
            VaultScreen(onBack = { navController.popBackStack() })
        }
        composable(Routes.SETTINGS) {
            SettingsScreen(onBack = { navController.popBackStack() })
        }
    }
}

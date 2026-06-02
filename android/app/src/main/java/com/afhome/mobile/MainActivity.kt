package com.afhome.mobile

import android.os.Build
import android.os.Bundle
import android.content.Intent
import android.net.Uri
import android.util.Log

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
  companion object {
    private const val TAG = "MainActivity"
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);

    // Handle deeplink from notification BEFORE React initializes
    // This ensures React's Linking.getInitialURL() picks up the deeplink
    handleNotificationIntent(intent)

    super.onCreate(null)
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    // Handle deeplink when app is already running and user taps notification
    handleNotificationIntent(intent)
  }

  private fun handleNotificationIntent(intent: Intent?) {
    Log.d(TAG, "handleNotificationIntent called with intent: $intent")
    Log.d(TAG, "Intent action before: ${intent?.action}")
    Log.d(TAG, "Intent data before: ${intent?.data}")

    val deeplink = intent?.getStringExtra("deeplink")
    Log.d(TAG, "Deeplink from extras: $deeplink")

    if (!deeplink.isNullOrEmpty()) {
      Log.d(TAG, "Notification deeplink received: $deeplink")
      // Create URI from deeplink string - React Navigation will handle it through app.json config
      val uri = Uri.parse(deeplink)
      Log.d(TAG, "Parsed URI: $uri")
      Log.d(TAG, "URI scheme: ${uri.scheme}, host: ${uri.host}, path: ${uri.path}")

      intent?.data = uri
      intent?.action = Intent.ACTION_VIEW
      intent?.addCategory(Intent.CATEGORY_BROWSABLE)

      Log.d(TAG, "Intent data after setting: ${intent?.data}")
      Log.d(TAG, "Intent action after setting: ${intent?.action}")

      setIntent(intent)

      Log.d(TAG, "After setIntent - getIntent().data: ${getIntent().data}")
      Log.d(TAG, "After setIntent - getIntent().action: ${getIntent().action}")
    } else {
      Log.d(TAG, "⚠️ No deeplink found in intent extras")
    }
  }

  /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than [Activity.moveTaskToBack] in fact.
      super.invokeDefaultOnBackPressed()
  }
}

package com.afhome.mobile

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import android.widget.RemoteViews
import android.view.View
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.PorterDuffXfermode
import android.graphics.PorterDuff
import android.graphics.Rect
import android.graphics.RectF
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import android.util.Log

class MyFirebaseMessagingService : FirebaseMessagingService() {

    companion object {
        private const val TAG = "MyFirebaseMessaging"
        private const val NOTIFICATION_CHANNEL_ID = "afhome_notifications"
        private const val NOTIFICATION_CHANNEL_NAME = "AF Home Notifications"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d(TAG, "From: ${remoteMessage.from}")

        // Handle both notification and data messages
        val title = remoteMessage.notification?.title ?: remoteMessage.data["title"] ?: "AF Home"
        val body = remoteMessage.notification?.body ?: remoteMessage.data["body"] ?: ""
        val imageUrl = remoteMessage.notification?.imageUrl?.toString() ?: remoteMessage.data["image"]

        // Extract deeplink from data payload
        val deeplink = remoteMessage.data["href"]
            ?: remoteMessage.data["deeplink"]
            ?: remoteMessage.data["purchases"]
            ?: "/orders"

        Log.d(TAG, "Title: $title")
        Log.d(TAG, "Body: $body")
        Log.d(TAG, "Image URL: $imageUrl")
        Log.d(TAG, "Deeplink: $deeplink")

        sendNotification(title, body, imageUrl, deeplink, remoteMessage.data)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                NOTIFICATION_CHANNEL_NAME,
                importance
            ).apply {
                description = "AF Home notifications"
                enableVibration(true)
                enableLights(true)
                setShowBadge(true)
                lightColor = 0x13a1d4
                setSound(
                    RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION),
                    android.media.AudioAttributes.Builder()
                        .setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION)
                        .build()
                )
                // Android 15 specific settings
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    setAllowBubbles(true)
                }
            }
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
            Log.d(TAG, "Notification channel created - IMPORTANCE_HIGH - Android ${Build.VERSION.SDK_INT}")
        }
    }

    private fun sendNotification(
        title: String,
        body: String,
        imageUrl: String?,
        deeplink: String,
        data: Map<String, String>
    ) {
        try {
            val intent = Intent(this, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                putExtra("deeplink", deeplink)
                putExtra("notification_data", data.toMutableMap() as? android.os.Bundle)
            }

            val pendingIntent = PendingIntent.getActivity(
                this,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

            // Get button text from data payload - only show button if provided
            val buttonText = data["buttonText"] ?: ""
            val hasButton = buttonText.isNotEmpty()

            val expandedRemoteView = RemoteViews(packageName, R.layout.notification_expanded).apply {
                setTextViewText(R.id.notification_title, title)
                setTextViewText(R.id.notification_body, body)

                // Show/hide button container based on whether buttonText is provided
                if (hasButton) {
                    setViewVisibility(R.id.button_container, View.VISIBLE)
                    setTextViewText(R.id.btn_action, buttonText)
                    setOnClickPendingIntent(R.id.btn_action, pendingIntent)
                } else {
                    setViewVisibility(R.id.button_container, View.GONE)
                }

                // Default: hide image, will show if imageUrl is provided
                setViewVisibility(R.id.notification_image, View.GONE)
            }
            val collapsedRemoteView = RemoteViews(packageName, R.layout.notification_collapsed).apply {
                setTextViewText(R.id.notification_collapsed_title, title)
                setTextViewText(R.id.notification_collapsed_body, body)
                setViewVisibility(R.id.notification_collapsed_image, View.GONE)
                setOnClickPendingIntent(R.id.notification_collapsed_title, pendingIntent)
                setOnClickPendingIntent(R.id.notification_collapsed_body, pendingIntent)
            }
            val notificationBuilder = NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(body)
                .setSmallIcon(R.drawable.ic_notification)
                .setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setContentIntent(pendingIntent)
                .setVibrate(longArrayOf(0, 250, 250, 250))
                .setColor(0x13a1d4)
                .setColorized(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_CALL) // Force heads-up in background
                .setFullScreenIntent(pendingIntent, false) // Show as heads-up even when app in background
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setStyle(NotificationCompat.DecoratedCustomViewStyle())
                .setCustomContentView(collapsedRemoteView)
                .setCustomBigContentView(expandedRemoteView)

            // Load and display image if provided
            if (!imageUrl.isNullOrEmpty()) {
                try {
                    val bitmap = getBitmapFromUrl(imageUrl)
                    if (bitmap != null) {
                        // Collapsed view: show small thumbnail on right side
                        collapsedRemoteView.setImageViewBitmap(R.id.notification_collapsed_image, bitmap)
                        collapsedRemoteView.setViewVisibility(R.id.notification_collapsed_image, View.VISIBLE)

                        // Expanded view: show larger image
                        expandedRemoteView.setImageViewBitmap(R.id.notification_image, bitmap)
                        expandedRemoteView.setViewVisibility(R.id.notification_image, View.VISIBLE)
                        Log.d(TAG, "✓ Image loaded: $imageUrl")
                    } else {
                        Log.w(TAG, "Failed to decode image bitmap")
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error loading notification image: ${e.message}")
                }
            } else {
                Log.d(TAG, "No image URL provided in notification")
            }


            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val notificationId = deeplink.hashCode()

            Log.d(TAG, "=== NOTIFICATION DEBUG ===")
            Log.d(TAG, "Notification ID: $notificationId")
            Log.d(TAG, "Channel ID: $NOTIFICATION_CHANNEL_ID")
            Log.d(TAG, "Priority: PRIORITY_HIGH")
            Log.d(TAG, "Sound: $defaultSoundUri")
            Log.d(TAG, "Vibrate: true")
            Log.d(TAG, "Color: #13a1d4")
            Log.d(TAG, "Title: $title")
            Log.d(TAG, "Body: $body")
            Log.d(TAG, "Actions: Custom expanded Test only button")
            Log.d(TAG, "========================")

            notificationManager.notify(notificationId, notificationBuilder.build())
            Log.d(TAG, "✓ Notification displayed with ID: $notificationId")

        } catch (e: Exception) {
            Log.e(TAG, "Error sending notification: ${e.message}", e)
        }
    }

    private fun getBitmapFromUrl(imageUrl: String): android.graphics.Bitmap? {
        return try {
            val url = java.net.URL(imageUrl)
            val connection = url.openConnection() as java.net.HttpURLConnection
            connection.doInput = true
            connection.connect()
            android.graphics.BitmapFactory.decodeStream(connection.inputStream)
        } catch (e: Exception) {
            Log.e(TAG, "Error downloading image from URL: ${e.message}")
            null
        }
    }

    private fun createRoundedBitmap(bitmap: Bitmap, cornerRadiusPx: Float): Bitmap {
        val output = Bitmap.createBitmap(bitmap.width, bitmap.height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(output)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG)
        val rect = Rect(0, 0, bitmap.width, bitmap.height)
        val rectF = RectF(rect)

        canvas.drawRoundRect(rectF, cornerRadiusPx, cornerRadiusPx, paint)
        paint.xfermode = PorterDuffXfermode(PorterDuff.Mode.SRC_IN)
        canvas.drawBitmap(bitmap, rect, rect, paint)
        paint.xfermode = null

        return output
    }

}

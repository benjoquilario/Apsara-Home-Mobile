package com.afhome.mobile

import android.appwidget.AppWidgetManager
import android.content.Intent
import android.util.Log
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import kotlinx.coroutines.runBlocking
import org.json.JSONArray
import org.json.JSONObject
import java.net.URL
import javax.net.ssl.HttpsURLConnection

class LeaderboardWidgetService : RemoteViewsService() {
    companion object {
        private const val TAG = "LeaderboardWidgetService"
        private const val CACHE_PREFS = "widget_cache"
        private const val CACHE_KEY = "top_referrers"
        private var cachedData: List<Pair<String, Int>>? = null

        fun getReferralData(context: android.content.Context): List<Pair<String, Int>> {
            return try {
                val data = fetchReferralsFromBackend()
                if (data.isNotEmpty()) {
                    // Cache successful data
                    cachedData = data
                    saveCacheToPrefs(context, data)
                    Log.d(TAG, "Data fetched and cached: ${data.size} referrers")
                    data
                } else {
                    // If fetch returned empty, try to use cached data
                    getCachedData(context)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error loading referral data: ${e.message}, using cache")
                // On error, use cached data
                getCachedData(context)
            }
        }

        private fun getCachedData(context: android.content.Context): List<Pair<String, Int>> {
            // Try in-memory cache first
            if (cachedData != null && cachedData!!.isNotEmpty()) {
                Log.d(TAG, "Using in-memory cache: ${cachedData!!.size} referrers")
                return cachedData!!
            }

            // Try SharedPreferences cache
            val prefs = context.getSharedPreferences(CACHE_PREFS, 0)
            val cachedJson = prefs.getString(CACHE_KEY, null)
            if (cachedJson != null) {
                try {
                    val jsonArray = JSONArray(cachedJson)
                    val data = mutableListOf<Pair<String, Int>>()
                    for (i in 0 until jsonArray.length()) {
                        val obj = jsonArray.getJSONObject(i)
                        data.add(Pair(obj.getString("name"), obj.getInt("count")))
                    }
                    cachedData = data
                    Log.d(TAG, "Using SharedPreferences cache: ${data.size} referrers")
                    return data
                } catch (e: Exception) {
                    Log.e(TAG, "Error reading cached data: ${e.message}")
                }
            }

            Log.w(TAG, "No cached data available")
            return emptyList()
        }

        private fun saveCacheToPrefs(context: android.content.Context, data: List<Pair<String, Int>>) {
            try {
                val jsonArray = JSONArray()
                for ((name, count) in data) {
                    val obj = JSONObject()
                    obj.put("name", name)
                    obj.put("count", count)
                    jsonArray.put(obj)
                }
                val prefs = context.getSharedPreferences(CACHE_PREFS, 0)
                prefs.edit().putString(CACHE_KEY, jsonArray.toString()).apply()
            } catch (e: Exception) {
                Log.e(TAG, "Error saving cache: ${e.message}")
            }
        }

        private fun fetchReferralsFromBackend(): List<Pair<String, Int>> = runBlocking {
            try {
                val url = URL("https://backend.afhome.ph/api/public/top-members?sort=referrals&per_page=10")
                val connection = url.openConnection() as HttpsURLConnection
                connection.apply {
                    requestMethod = "GET"
                    setRequestProperty("Accept", "application/json")
                    setRequestProperty("User-Agent", "AFHomeWidget/1.0")
                    connectTimeout = 15000
                    readTimeout = 15000
                }

                if (connection.responseCode == HttpsURLConnection.HTTP_OK) {
                    val response = connection.inputStream.bufferedReader().readText()
                    val jsonObject = JSONObject(response)
                    val jsonArray = jsonObject.optJSONArray("data") ?: JSONArray()

                    val referrals = mutableListOf<Pair<String, Int>>()
                    for (i in 0 until jsonArray.length()) {
                        val memberObj = jsonArray.getJSONObject(i)
                        val name = memberObj.optString("name", "Unknown")
                        val referralCount = memberObj.optInt("referrals", 0)
                        referrals.add(Pair(name, referralCount))
                    }
                    Log.d(TAG, "Fetched ${referrals.size} top members from backend")
                    referrals
                } else {
                    Log.w(TAG, "Failed to fetch members: ${connection.responseCode}")
                    emptyList()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception fetching members: ${e.message}", e)
                emptyList()
            }
        }

        fun getLeaderboardData(context: android.content.Context): List<LeaderboardUser> {
            return try {
                val token = getTokenFromSharedPreferences(context)
                if (token.isNullOrEmpty()) {
                    Log.w(TAG, "No auth token found")
                    return emptyList()
                }

                fetchLeaderboardFromBackend(token)
            } catch (e: Exception) {
                Log.e(TAG, "Error loading leaderboard data: ${e.message}", e)
                emptyList()
            }
        }

        private fun fetchLeaderboardFromBackend(token: String): List<LeaderboardUser> = runBlocking {
            try {
                val url = URL("https://backend.afhome.ph/api/leaderboard/top")
                val connection = url.openConnection() as HttpsURLConnection
                connection.apply {
                    requestMethod = "GET"
                    setRequestProperty("Authorization", "Bearer $token")
                    setRequestProperty("Accept", "application/json")
                    connectTimeout = 5000
                    readTimeout = 5000
                }

                if (connection.responseCode == HttpsURLConnection.HTTP_OK) {
                    val response = connection.inputStream.bufferedReader().readText()
                    val jsonArray = JSONArray(response)

                    val users = mutableListOf<LeaderboardUser>()
                    for (i in 0 until jsonArray.length()) {
                        val userObj = jsonArray.getJSONObject(i)
                        users.add(
                            LeaderboardUser(
                                id = userObj.optInt("id"),
                                name = userObj.optString("name", "Unknown"),
                                points = userObj.optInt("points", 0),
                                avatar = userObj.optString("avatar", "")
                            )
                        )
                    }
                    users
                } else {
                    Log.w(TAG, "Failed to fetch leaderboard: ${connection.responseCode}")
                    emptyList()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception fetching leaderboard: ${e.message}", e)
                emptyList()
            }
        }

        private fun getTokenFromSharedPreferences(context: android.content.Context): String? {
            return try {
                val masterKey = MasterKey.Builder(context)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build()

                val sharedPreferences = EncryptedSharedPreferences.create(
                    context,
                    "secure_prefs",
                    masterKey,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
                )

                sharedPreferences.getString("auth_token", null)
            } catch (e: Exception) {
                Log.e(TAG, "Error getting token from SharedPreferences: ${e.message}")
                null
            }
        }
    }

    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory {
        return LeaderboardRemoteViewsFactory(this.applicationContext, intent)
    }

    private class LeaderboardRemoteViewsFactory(
        private val context: android.content.Context,
        private val intent: Intent
    ) : RemoteViewsFactory {
        private val widgetId = intent.getIntExtra(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID
        )
        private var leaderboardData: List<LeaderboardUser> = emptyList()

        override fun onCreate() {
            Log.d(TAG, "RemoteViewsFactory created for widget $widgetId")
            loadLeaderboardData()
        }

        override fun onDataSetChanged() {
            Log.d(TAG, "Data set changed for widget $widgetId")
            loadLeaderboardData()
        }

        override fun onDestroy() {
            Log.d(TAG, "RemoteViewsFactory destroyed for widget $widgetId")
        }

        override fun getCount(): Int = leaderboardData.size.coerceAtMost(10) // Show top 10

        override fun getViewAt(position: Int): RemoteViews {
            val views = RemoteViews(context.packageName, android.R.layout.simple_list_item_1)

            if (position < leaderboardData.size) {
                val user = leaderboardData[position]
                val displayText = "${position + 1}. ${user.name} - ${user.points} pts"
                views.setTextViewText(android.R.id.text1, displayText)
            }

            return views
        }

        override fun getLoadingView(): RemoteViews? = null

        override fun getViewTypeCount(): Int = 1

        override fun getItemId(position: Int): Long = position.toLong()

        override fun hasStableIds(): Boolean = true

        private fun loadLeaderboardData() {
            try {
                val token = getTokenFromSharedPreferences()
                if (token.isNullOrEmpty()) {
                    Log.w(TAG, "No auth token found")
                    leaderboardData = emptyList()
                    return
                }

                val leaderboardUsers = fetchLeaderboardFromBackend(token)
                leaderboardData = leaderboardUsers
                Log.d(TAG, "Loaded ${leaderboardData.size} users for widget leaderboard")
            } catch (e: Exception) {
                Log.e(TAG, "Error loading leaderboard data: ${e.message}", e)
                leaderboardData = emptyList()
            }
        }

        private fun fetchLeaderboardFromBackend(token: String): List<LeaderboardUser> = runBlocking {
            try {
                val url = URL("https://backend.afhome.ph/api/leaderboard/top")
                val connection = url.openConnection() as HttpsURLConnection
                connection.apply {
                    requestMethod = "GET"
                    setRequestProperty("Authorization", "Bearer $token")
                    setRequestProperty("Accept", "application/json")
                    connectTimeout = 5000
                    readTimeout = 5000
                }

                if (connection.responseCode == HttpsURLConnection.HTTP_OK) {
                    val response = connection.inputStream.bufferedReader().readText()
                    val jsonArray = JSONArray(response)

                    val users = mutableListOf<LeaderboardUser>()
                    for (i in 0 until jsonArray.length()) {
                        val userObj = jsonArray.getJSONObject(i)
                        users.add(
                            LeaderboardUser(
                                id = userObj.optInt("id"),
                                name = userObj.optString("name", "Unknown"),
                                points = userObj.optInt("points", 0),
                                avatar = userObj.optString("avatar", "")
                            )
                        )
                    }
                    users
                } else {
                    Log.w(TAG, "Failed to fetch leaderboard: ${connection.responseCode}")
                    emptyList()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception fetching leaderboard: ${e.message}", e)
                emptyList()
            }
        }

        private fun getTokenFromSharedPreferences(): String? {
            return try {
                val masterKey = MasterKey.Builder(context)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build()

                val sharedPreferences = EncryptedSharedPreferences.create(
                    context,
                    "secure_prefs",
                    masterKey,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
                )

                sharedPreferences.getString("auth_token", null)
            } catch (e: Exception) {
                Log.e(TAG, "Error getting token from SharedPreferences: ${e.message}")
                null
            }
        }
    }

    data class LeaderboardUser(
        val id: Int,
        val name: String,
        val points: Int,
        val avatar: String
    )

    data class TopReferrer(
        val name: String,
        val count: Int,
        val avatar: String
    )
}

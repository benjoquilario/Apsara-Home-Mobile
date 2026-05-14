import { useEffect } from 'react';
import { Platform, PermissionsAndroid, Linking } from 'react-native';
import {
  getMessaging,
  onMessage,
  getToken,
  getInitialNotification,
  onNotificationOpenedApp,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import axios from 'axios';
import { API_CONFIG } from '../config/api';


// Register handlers at module level (only once)
let backgroundHandlerRegistered = false;
let foregroundHandlerRegistered = false;

const registerBackgroundMessageHandler = () => {
  if (backgroundHandlerRegistered) return;
  backgroundHandlerRegistered = true;

  getMessaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('[useFirebaseMessaging] Background message received:', remoteMessage);
    console.log('[useFirebaseMessaging] Background data payload:', remoteMessage.data);

    try {
      const title = remoteMessage.data?.title || remoteMessage.notification?.title || 'New notification';
      const body = remoteMessage.data?.body || remoteMessage.data?.message || remoteMessage.notification?.body || '';
      const imageUrl = remoteMessage.data?.image || remoteMessage.notification?.imageUrl || null;
      const deeplink = remoteMessage.data?.href || remoteMessage.data?.deeplink || null;


      console.log('[useFirebaseMessaging] Background parsed:', { title, body, imageUrl, deeplink });

      console.log('[useFirebaseMessaging] Background: Displaying with notifee');

      // Create Android channel for background notifications
      let androidChannelId: string | undefined;
      if (Platform.OS === 'android') {
        androidChannelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Notifications',
          importance: AndroidImportance.HIGH,
        });
      }

      const notificationConfig: any = {
        title,
        body,
        data: {
          href: deeplink || '/orders',
        },
        android: {
          channelId: androidChannelId || 'default',
          smallIcon: 'ic_stat_notify',
          pressAction: {
            id: 'default',
          },
          actions: [
            {
              title: 'View Order',
              pressAction: {
                id: 'view-order',
              },
            },
            {
              title: 'Dismiss',
              pressAction: {
                id: 'dismiss',
              },
            },
          ],
        },
      };

      // Display with image - largeIcon (small image)
      if (imageUrl) {
        try {
          console.log('[useFirebaseMessaging] Background: Attempting largeIcon with image:', imageUrl);
          await notifee.displayNotification({
            ...notificationConfig,
            android: {
              ...notificationConfig.android,
              largeIcon: imageUrl,
            },
          });
          console.log('[useFirebaseMessaging] Background notification with largeIcon displayed');
          return;
        } catch (largeIconError) {
          console.warn('[useFirebaseMessaging] Background: largeIcon failed, showing without image:', largeIconError);
        }
      }

      // Fallback: Always show notification with buttons (with or without image)
      await notifee.displayNotification(notificationConfig);
      console.log('[useFirebaseMessaging] Background notification displayed (buttons only)');
    } catch (error) {
      console.error('[useFirebaseMessaging] Background message error:', error);
    }
  });
};

export const useFirebaseMessaging = (token: string | null, userId: string | number | null) => {
  useEffect(() => {
    if (!token || !userId) {
      return;
    }

    const setupMessaging = async () => {
      try {
        console.log('[useFirebaseMessaging] Setting up Firebase Cloud Messaging...');

        // Register background message handler
        registerBackgroundMessageHandler();

        const messaging_ = getMessaging();
        let permissionEnabled = true;
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const permissionResult = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          permissionEnabled = permissionResult === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (!permissionEnabled) {
          console.warn('[useFirebaseMessaging] Notification permission not granted on Android');
          return;
        }

        let androidChannelId: string | undefined;
        if (Platform.OS === 'android') {
          androidChannelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Notifications',
            importance: AndroidImportance.HIGH,
          });
        }

        const registerFcmToken = async (fcmToken: string) => {
          const platform = Platform.OS === 'android' ? 'android' : 'ios';
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/notifications/fcm/register-token`,
            {
              fcm_token: fcmToken,
              device_name: `${platform}-device`,
              platform,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.status === 200 || response.status === 201) {
            console.log('[useFirebaseMessaging] FCM token registered successfully');
          }
        };

        const fcmToken = await getToken(messaging_);
        console.log('[useFirebaseMessaging] FCM Token:', fcmToken);

        if (!fcmToken) {
          console.warn('[useFirebaseMessaging] Failed to get FCM token');
          return;
        }

        await registerFcmToken(fcmToken);

        const unsubscribeTokenRefresh = onTokenRefresh(messaging_, async (newToken) => {
          try {
            console.log('[useFirebaseMessaging] FCM token refreshed:', newToken);
            await registerFcmToken(newToken);
          } catch (refreshError) {
            console.error('[useFirebaseMessaging] Failed to register refreshed token:', refreshError);
          }
        });

        // Register foreground handler only once
        let unsubscribe: any;
        if (!foregroundHandlerRegistered) {
          foregroundHandlerRegistered = true;
          console.log('[useFirebaseMessaging] Registering foreground handler (first time)');

          unsubscribe = onMessage(messaging_, async (remoteMessage) => {
          console.log('[useFirebaseMessaging] Foreground notification received:', remoteMessage);
          console.log('[useFirebaseMessaging] Foreground data payload:', remoteMessage.data);

          const title = remoteMessage.data?.title || remoteMessage.notification?.title || 'New notification';
          const body = remoteMessage.data?.body || remoteMessage.data?.message || remoteMessage.notification?.body || '';
          const imageUrl = remoteMessage.data?.image || remoteMessage.notification?.imageUrl || null;
          const deeplink = remoteMessage.data?.href || remoteMessage.data?.deeplink || null;

          console.log('[useFirebaseMessaging] Foreground parsed:', { title, body, imageUrl, deeplink });
          console.log('[useFirebaseMessaging] About to create notificationConfig...');

          try {
            // Notification config with deeplink and action buttons
            const notificationConfig: any = {
              title,
              body,
              data: {
                href: deeplink || '/orders',
              },
              android: {
                channelId: androidChannelId || 'default',
                smallIcon: 'ic_stat_notify',
                pressAction: {
                  id: 'default',
                },
                actions: [
                  {
                    title: 'View Order',
                    pressAction: {
                      id: 'view-order',
                    },
                  },
                  {
                    title: 'Dismiss',
                    pressAction: {
                      id: 'dismiss',
                    },
                  },
                ],
              },
            };

            console.log('[useFirebaseMessaging] Foreground notificationConfig created, imageUrl:', imageUrl);

            // Display with image - largeIcon (small image)
            console.log('[useFirebaseMessaging] Checking imageUrl:', imageUrl ? 'YES - will attempt display' : 'NO - will show without image');
            if (imageUrl) {
              try {
                console.log('[useFirebaseMessaging] Foreground: Attempting largeIcon with image:', imageUrl);
                await notifee.displayNotification({
                  ...notificationConfig,
                  android: {
                    ...notificationConfig.android,
                    largeIcon: imageUrl,
                  },
                });
                console.log('[useFirebaseMessaging] Foreground notification with largeIcon displayed');
                return;
              } catch (largeIconError) {
                console.warn('[useFirebaseMessaging] Foreground: largeIcon failed, showing without image:', largeIconError);
              }
            }

            // Fallback: Always show notification with buttons (with or without image)
            console.log('[useFirebaseMessaging] Displaying notification with buttons');
            await notifee.displayNotification(notificationConfig);
          } catch (displayError) {
            console.error('[useFirebaseMessaging] Foreground local notification failed:', displayError);
          }
          });
        } else {
          console.log('[useFirebaseMessaging] Foreground handler already registered, skipping');
          unsubscribe = () => {}; // dummy
        }

        // Handle notification press (when user clicks the notification and app opens from background)
        const unsubscribeOnNotificationOpenedApp = onNotificationOpenedApp(messaging_, (remoteMessage) => {
          console.log('[useFirebaseMessaging] App opened from notification:', remoteMessage);
          const deeplink = remoteMessage?.data?.href || remoteMessage?.data?.deeplink;
          if (deeplink) {
            console.log('[useFirebaseMessaging] Emitting deeplink event:', deeplink);
            Linking.openURL(deeplink).catch(err => {
              console.error('[useFirebaseMessaging] Failed to open deeplink:', err);
            });
          }
        });

        // Handle foreground notification press (notifee - when app is already open)
        const unsubscribeNotifeePress = notifee.onForegroundEvent(({ type, notification, pressAction }) => {
          console.log('[useFirebaseMessaging] Foreground notification event:', type, pressAction?.id, notification);

          if (type === 1) { // PressAction = 1 (notification body pressed)
            const deeplink = notification?.data?.href as string | undefined;
            if (deeplink) {
              console.log('[useFirebaseMessaging] User pressed foreground notification, emitting deeplink:', deeplink);
              Linking.openURL(deeplink).catch(err => {
                console.error('[useFirebaseMessaging] Failed to open deeplink:', err);
              });
            }
          } else if (type === 2) { // ActionPress = 2 (action button pressed)
            const actionId = pressAction?.id;
            console.log('[useFirebaseMessaging] User pressed action button:', actionId);

            if (actionId === 'view-order') {
              const deeplink = notification?.data?.href as string | undefined;
              if (deeplink) {
                console.log('[useFirebaseMessaging] Opening deeplink from action button:', deeplink);
                Linking.openURL(deeplink).catch(err => {
                  console.error('[useFirebaseMessaging] Failed to open deeplink:', err);
                });
              }
            } else if (actionId === 'dismiss') {
              console.log('[useFirebaseMessaging] User dismissed notification');
              // Notification is automatically dismissed
            }
          }
        });

        // Handle app opened from closed state via notification or button press
        const notificationOpenedApp = await getInitialNotification(messaging_);
        if (notificationOpenedApp) {
          console.log('[useFirebaseMessaging] App opened from closed state via notification:', notificationOpenedApp);
          const deeplink = notificationOpenedApp?.data?.href || notificationOpenedApp?.data?.deeplink;
          if (deeplink) {
            console.log('[useFirebaseMessaging] Emitting deeplink from closed state:', deeplink);
            Linking.openURL(deeplink).catch(err => {
              console.error('[useFirebaseMessaging] Failed to open deeplink:', err);
            });
          }
        }

        // Handle background notification opened (when app is in background)
        const unsubscribeNotificationOpened = onNotificationOpenedApp(messaging_, (remoteMessage) => {
          console.log('[useFirebaseMessaging] Notification opened from background:', remoteMessage);
          const deeplink = remoteMessage?.data?.href || remoteMessage?.data?.deeplink;
          if (deeplink) {
            console.log('[useFirebaseMessaging] Emitting deeplink from background state:', deeplink);
            Linking.openURL(deeplink).catch(err => {
              console.error('[useFirebaseMessaging] Failed to open deeplink:', err);
            });
          }
        });

        return () => {
          unsubscribe();
          unsubscribeNotificationOpened();
          unsubscribeTokenRefresh();
          if (unsubscribeOnNotificationOpenedApp) {
            unsubscribeOnNotificationOpenedApp();
          }
          if (unsubscribeNotifeePress) {
            unsubscribeNotifeePress();
          }
        };
      } catch (error) {
        console.error('[useFirebaseMessaging] Error:', error);
      }
    };

    setupMessaging();
  }, [token, userId]);

  return null;
};

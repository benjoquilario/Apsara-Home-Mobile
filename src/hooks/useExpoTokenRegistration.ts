import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { storageService } from '../services/storageService';
import { API_CONFIG } from '../config/api';
import axios from 'axios';

export const useExpoTokenRegistration = (token: string | null, userId: string | null) => {
  useEffect(() => {
    if (!token || !userId) {
      return;
    }

    const registerExpoToken = async () => {
      try {

        // Get the Expo push token
        const expoPushToken = await Notifications.getExpoPushTokenAsync({
          projectId: 'ed682d76-4287-4417-a52d-35601ed2fe7e', // from app.json
        });

        const pushToken = expoPushToken.data;
        console.log('[useExpoTokenRegistration] Got Expo push token:', pushToken);

        // Get device information
        const deviceName = `${Device.brand || 'Device'} ${Device.modelName || ''}`.trim();
        const platform = Platform.OS === 'android' ? 'android' : 'ios';

        // Call the registration endpoint
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/notifications/expo/register-token`,
          {
            token: pushToken,
            device_name: deviceName,
            platform: platform,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          console.log('[useExpoTokenRegistration] ✅ Token registered successfully');
        }
      } catch (error) {
        console.error('[useExpoTokenRegistration] Failed to register Expo token:', error);
      }
    };

    registerExpoToken();
  }, [token, userId]);
};

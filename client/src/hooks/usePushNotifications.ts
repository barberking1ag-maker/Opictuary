import { useEffect, useState } from 'react';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const initializePushNotifications = async () => {
      try {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
          setError('Push notification permission denied');
          return;
        }

        await PushNotifications.register();
        setIsRegistered(true);

        PushNotifications.addListener('registration', (token: Token) => {
          setToken(token.value);
        });

        PushNotifications.addListener('registrationError', (err: any) => {
          setError(err.error || 'Failed to register for push notifications');
        });

        PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
          console.log('Push notification received:', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
          console.log('Push notification action performed:', notification);
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize push notifications';
        setError(errorMessage);
      }
    };

    initializePushNotifications();

    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, []);

  const registerToken = async (memorialId: string) => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch('/api/push-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          memorialId,
          platform: Capacitor.getPlatform()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register push token');
      }
    } catch (err) {
      console.error('Error registering push token:', err);
    }
  };

  return {
    token,
    error,
    isRegistered,
    registerToken,
    isNative: Capacitor.isNativePlatform()
  };
}

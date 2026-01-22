import { useEffect, useState } from 'react';

// Safe check for native platform without importing Capacitor at module load
const isNativePlatform = (): boolean => {
  try {
    return typeof window !== 'undefined' && 
           !!(window as any).Capacitor && 
           typeof (window as any).Capacitor.isNativePlatform === 'function' &&
           (window as any).Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

const getPlatform = (): string => {
  try {
    if (typeof window !== 'undefined' && 
        (window as any).Capacitor && 
        typeof (window as any).Capacitor.getPlatform === 'function') {
      return (window as any).Capacitor.getPlatform();
    }
  } catch {
    // Ignore
  }
  return 'web';
};

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!isNativePlatform()) {
      return;
    }

    const initializePushNotifications = async () => {
      try {
        // Dynamic import to avoid loading Capacitor modules at startup
        const { PushNotifications } = await import('@capacitor/push-notifications');
        
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

        PushNotifications.addListener('registration', (tokenData) => {
          setToken(tokenData.value);
        });

        PushNotifications.addListener('registrationError', (err: any) => {
          setError(err.error || 'Failed to register for push notifications');
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received:', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push notification action performed:', notification);
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize push notifications';
        setError(errorMessage);
      }
    };

    initializePushNotifications();

    return () => {
      if (isNativePlatform()) {
        import('@capacitor/push-notifications').then(({ PushNotifications }) => {
          PushNotifications.removeAllListeners();
        }).catch(() => {});
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
          platform: getPlatform()
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
    isNative: isNativePlatform()
  };
}

import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export function useQRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanQRCode = async (): Promise<string | null> => {
    if (!Capacitor.isNativePlatform()) {
      setError('QR scanning is only available on mobile devices');
      return null;
    }

    try {
      setIsScanning(true);
      setError(null);

      const result = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      return result.webPath || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan QR code';
      setError(errorMessage);
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const checkPermissions = async () => {
    try {
      const permissions = await Camera.checkPermissions();
      return permissions.camera === 'granted';
    } catch (err) {
      console.error('Error checking camera permissions:', err);
      return false;
    }
  };

  const requestPermissions = async () => {
    try {
      const permissions = await Camera.requestPermissions();
      return permissions.camera === 'granted';
    } catch (err) {
      console.error('Error requesting camera permissions:', err);
      return false;
    }
  };

  return {
    scanQRCode,
    isScanning,
    error,
    checkPermissions,
    requestPermissions,
    isNative: Capacitor.isNativePlatform()
  };
}

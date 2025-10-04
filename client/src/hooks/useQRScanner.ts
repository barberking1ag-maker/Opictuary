import { useState } from 'react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
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

      const granted = await checkPermissions();
      if (!granted) {
        const permissionGranted = await requestPermissions();
        if (!permissionGranted) {
          setError('Camera permission denied');
          return null;
        }
      }

      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode]
      });

      if (barcodes.length > 0) {
        return barcodes[0].rawValue;
      }

      return null;
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
      const { camera } = await BarcodeScanner.checkPermissions();
      return camera === 'granted';
    } catch (err) {
      console.error('Error checking camera permissions:', err);
      return false;
    }
  };

  const requestPermissions = async () => {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera === 'granted';
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

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.opictuary.memorial',
  appName: 'Opictuary',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Remove the URL for production builds - use bundled assets
    // url: 'https://eternal-tribute-barbering-tag.replit.app',
    cleartext: false
  },
  ios: {
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2C1810",
      showSpinner: false,
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: "#2C1810"
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;

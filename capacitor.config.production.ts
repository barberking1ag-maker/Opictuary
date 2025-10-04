import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.opictuary.app',
  appName: 'Opictuary',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    url: 'https://your-app-name.replit.app',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2C1810",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: "#2C1810"
    }
  }
};

export default config;

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.opictuary.app',
  appName: 'Opictuary',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
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

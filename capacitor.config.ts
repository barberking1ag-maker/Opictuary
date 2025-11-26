import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.opictuary.memorial',
  appName: 'Opictuary',
  webDir: 'client/dist',
  android: {
    buildOptions: {
      versionCode: 2025112601,
      versionName: '2.1.0'
    }
  }
};

export default config;

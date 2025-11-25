import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.opictuary.memorial',
  appName: 'Opictuary',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  }
};

export default config;

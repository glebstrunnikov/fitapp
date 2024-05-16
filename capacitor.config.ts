import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glebstrunnikov.fitapp',
  appName: 'fitapp',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

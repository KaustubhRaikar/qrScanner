import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { useState, useEffect } from 'react';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = 'qrscanner_device_id';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const getDeviceId = async () => {
      let id = await SecureStore.getItemAsync(DEVICE_ID_KEY);
      
      if (!id) {
        if (Platform.OS === 'android') {
          id = (Application as any).androidId || (await (Application as any).getAndroidId?.());
        }
        
        if (!id) {
          // Fallback if androidId is missing or on iOS
          id = Crypto.randomUUID();
        }
        
        if (id) {
          await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
        }
      }
      
      setDeviceId(id);
    };

    getDeviceId();
  }, []);

  return deviceId;
};

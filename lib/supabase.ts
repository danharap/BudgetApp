import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Platform-aware storage adapter.
 * - Native (iOS / Android): uses expo-secure-store (hardware-backed encryption).
 * - Web: falls back to localStorage so the web bundler/preview doesn't crash.
 */
const storageAdapter =
  Platform.OS === 'web'
    ? {
        getItem: (key: string): Promise<string | null> =>
          Promise.resolve(
            typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null,
          ),
        setItem: (key: string, value: string): Promise<void> => {
          if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
          return Promise.resolve();
        },
        removeItem: (key: string): Promise<void> => {
          if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
          return Promise.resolve();
        },
      }
    : {
        getItem: (key: string): Promise<string | null> =>
          SecureStore.getItemAsync(key),
        setItem: (key: string, value: string): Promise<void> =>
          SecureStore.setItemAsync(key, value),
        removeItem: (key: string): Promise<void> =>
          SecureStore.deleteItemAsync(key),
      };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

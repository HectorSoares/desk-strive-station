import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''

const customStorage = Platform.OS === 'web' ? undefined : AsyncStorage;

let customTransport = undefined;
if (Platform.OS === 'web') {
  try {
    customTransport = require('ws');
  } catch (e) {
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: customStorage,
    autoRefreshToken: Platform.OS !== 'web',
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    transport: customTransport,
  },
});
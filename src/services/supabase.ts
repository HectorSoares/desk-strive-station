import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'http://127.0.0.1:55321';
const SUPABASE_ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

const customStorage = Platform.OS === 'web' ? undefined : AsyncStorage;

// Importa o ws de forma segura apenas se não for mobile nativo (ex: web ou bundler do Metro)
let customTransport = undefined;
if (Platform.OS === 'web') {
  // Na web o browser já tem WebSocket nativo, mas se o Metro reclamar, podemos ajustar.
  // No Node/Metro, se precisar do ws:
  try {
    customTransport = require('ws');
  } catch (e) {
    // ignora se não estiver disponível
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
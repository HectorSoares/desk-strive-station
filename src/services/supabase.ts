import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import ws from 'ws';

if (!globalThis.WebSocket) {
  globalThis.WebSocket = ws as any;
}

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

// O AsyncStorage nativo quebra na Web se chamado direto no SSR. 
// No mobile usa o AsyncStorage, na web usa undefined (o supabase usa o localStorage nativo do browser automaticamente).
const customStorage = Platform.OS === 'web' ? undefined : AsyncStorage;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: customStorage,
    autoRefreshToken: Platform.OS !== 'web',
    persistSession: true,
    detectSessionInUrl: false,
  },
});
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Asegúrate de que estas variables estén definidas en tu archivo .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

// Obtener la URL base de la aplicación
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://u8vnj80-nicolasv0-8081.exp.direct';
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
    debug: true,
    redirectTo: `${getBaseUrl()}/verify-email`
  },
}); 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
    try {
        const u = new URL(url);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (_) {
        return false;
    }
};

const isConfigured = 
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL' && 
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' && 
    isValidUrl(supabaseUrl);

if (!isConfigured) {
    console.warn(
        '[Supabase] Missing env vars VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
        'Add them to your .env.local file.'
    );
}

// Fallback to a valid placeholder URL if unconfigured to prevent crash on import
const finalUrl = isConfigured ? supabaseUrl : 'https://placeholder-unconfigured.supabase.co';
const finalKey = isConfigured ? supabaseAnonKey : 'dummy-anon-key';

export const supabase = createClient(finalUrl, finalKey);

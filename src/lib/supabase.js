import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yvylpcbwcokzccgxuxsb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eWxwY2J3Y29remNjZ3h1eHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDgzMTAsImV4cCI6MjEwMzQ4NDMxMH0.HMBkcM7kujMiyImhfvHo1oQTbZK-W0DTefz1JBDnyJE';

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

export const supabase = createClient(
    isConfigured ? supabaseUrl : 'https://yvylpcbwcokzccgxuxsb.supabase.co',
    isConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eWxwY2J3Y29remNjZ3h1eHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDgzMTAsImV4cCI6MjEwMzQ4NDMxMH0.HMBkcM7kujMiyImhfvHo1oQTbZK-W0DTefz1JBDnyJE'
);

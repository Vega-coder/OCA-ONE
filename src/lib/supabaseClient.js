import { createClient } from '@supabase/supabase-js';

// Reemplazar o configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_RCGIv6e07yJIQVgLzqMDSw_rnUlkv8i';

export const supabase = createClient(supabaseUrl, supabaseKey);

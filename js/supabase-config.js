// Fill these in with your Supabase project values:
// Project Settings -> API -> Project URL / publishable key
const SUPABASE_URL = 'https://vodvppzkmtuyrwsxazoo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dzK-986yGoc-yW0-_cD8Qg_Jv-ia_Ag';

// Requires the supabase-js CDN script to be loaded before this file:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fill these in with your Supabase project values:
// Project Settings -> API -> Project URL / anon public key
const SUPABASE_URL = 'https://cgvtndympbpkslwyvrqo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndnRuZHltcGJwa3Nsd3l2cnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTk1MjgsImV4cCI6MjA5NzA5NTUyOH0.W_ooEntUpHtzTf2bEvG4BON7HQLWImdAsMyUUXbRyxo';

// Requires the supabase-js CDN script to be loaded before this file:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

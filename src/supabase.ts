import { createClient } from '@supabase/supabase-js'

// Folosim variabilele de mediu furnizate
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zzglgdokvvsehayldvka.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7JEFDUGZLZxlMsv45JXTJA_2CdIxijp'

export const supabase = createClient(supabaseUrl, supabaseKey)
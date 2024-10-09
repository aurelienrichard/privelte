import { createClient } from '@supabase/supabase-js'
import { PUBLIC_PRIVELTE_SUPABASE_URL } from '$env/static/public'
import { PRIVELTE_SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import type { Database } from '$lib/types/supabase'

export const supabase = createClient<Database>(
	PUBLIC_PRIVELTE_SUPABASE_URL,
	PRIVELTE_SUPABASE_SERVICE_ROLE_KEY
)

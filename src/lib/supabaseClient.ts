import { createClient } from '@supabase/supabase-js'
import { PUBLIC_PRIVELTE_SUPABASE_URL, PUBLIC_PRIVELTE_SUPABASE_ANON_KEY } from '$env/static/public'

export const supabase = createClient(
	PUBLIC_PRIVELTE_SUPABASE_URL,
	PUBLIC_PRIVELTE_SUPABASE_ANON_KEY,
	{
		realtime: {
			params: {
				eventsPerSecond: 5
			}
		}
	}
)

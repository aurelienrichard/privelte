// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type DeletePayload = {
	type: 'DELETE'
	table: string
	schema: string
	record: null
	old_record: {
		room_id: string
		username: string
	}
}

Deno.serve(async (req) => {
	const {
		old_record: { room_id, username }
	}: DeletePayload = await req.json()

	const supabase = createClient(
		Deno.env.get('SUPABASE_URL') ?? '',
		Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
	)

	const channel = supabase.channel(room_id, {
		config: { broadcast: { ack: true } }
	})

	try {
		const response = await channel.send({
			type: 'broadcast',
			event: 'presence',
			payload: {
				username,
				event: 'left'
			}
		})

		if (response !== 'ok') {
			throw Error()
		}

		return new Response(null, { status: 204 })
	} catch {
		return new Response(null, { status: 500 })
	} finally {
		await supabase.removeChannel(channel)
	}
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/leave-presence' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

import { error } from '@sveltejs/kit'
import { verifyUser } from '$lib/server/auth'
import { supabase } from '$lib/server/supabaseServer'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ params, cookies }) => {
	const room = await supabase.from('rooms').select('*').eq('id', params.id).single()

	if (room.error) {
		error(404, { message: 'This room does not exist.' })
	}

	if (room.data.participants === room.data.slots) {
		const session = cookies.get('session')

		try {
			await verifyUser(session, room.data.id)
		} catch {
			error(403, { message: 'This room is full.' })
		}
	}

	return {
		roomId: room.data.id
	}
}

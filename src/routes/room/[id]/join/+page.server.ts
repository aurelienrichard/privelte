import { redirect, type Actions, error } from '@sveltejs/kit'
import { createToken, verifyUser } from '$lib/server/auth'
import { newUserSchema } from '$lib/types/schemas'
import { supabase } from '$lib/server/supabaseServer'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, cookies }) => {
	const session = cookies.get('session')

	try {
		await verifyUser(session, params.id)
	} catch {
		return { title: 'Join Room' }
	}

	return redirect(303, `/room/${params.id}`)
}

export const actions: Actions = {
	default: async ({ cookies, request, params }) => {
		const room = await supabase.from('rooms').select('*').eq('id', params.id!).single()

		if (room.error) {
			error(404, { message: 'This room does not exist.' })
		}

		const participants = room.data.participants ?? 0

		if (participants === room.data.slots) {
			error(403, { message: 'This room is full.' })
		}

		const form = await request.formData()

		try {
			const { username } = newUserSchema.parse({
				username: form.get('username')
			})

			const user = await supabase
				.from('users')
				.insert({ room_id: room.data.id, username })
				.select()
				.single()
				.throwOnError()

			const { jwt, expires } = await createToken({ userId: user.data!.id, username })

			cookies.set('session', jwt, {
				path: `/room/${room.data.id}`,
				expires
			})
		} catch (e) {
			console.error(e)
			error(500, { message: 'Internal error.' })
		}

		redirect(303, `/room/${params.id}`)
	}
}

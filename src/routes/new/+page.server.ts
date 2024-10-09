import { error, redirect } from '@sveltejs/kit'
import {
	uniqueNamesGenerator,
	type Config,
	adjectives,
	animals,
	NumberDictionary
} from 'unique-names-generator'
import { newRoomSchema } from '$lib/types/schemas'
import { isValidId } from '$lib/utils'
import type { Actions, PageServerLoad } from './$types'
import { supabase } from '$lib/server/supabaseServer'

export const load: PageServerLoad = () => {
	const number = NumberDictionary.generate({ min: 100, max: 999 })
	const config: Config = {
		dictionaries: [adjectives, animals, number],
		separator: '-'
	}
	const id = uniqueNamesGenerator(config)

	return { id, title: 'New Room' }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData()
		const { id, slots } = newRoomSchema.parse({
			id: form.get('id'),
			slots: form.get('slots')
		})

		if (!isValidId(id, adjectives, animals)) {
			error(400, { message: 'Invalid ID.' })
		}

		const room = await supabase.from('rooms').insert({ id, slots }).select().single()

		if (room.error) {
			error(500, { message: 'Internal error.' })
		}

		redirect(303, `/room/${id}`)
	}
}

import { error, json } from '@sveltejs/kit'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '$lib/server/supabaseServer'
import { createToken, verifyToken, verifyUser } from '$lib/server/auth'
import { newMessageSchema } from '$lib/types/schemas'
import type { Payload } from '$lib/types/types'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, cookies, params }) => {
	const session = cookies.get('session')

	const channel = supabase.channel(params.id, {
		config: { broadcast: { ack: true } }
	})

	try {
		const { userId, username } = await verifyUser(session, params.id)
		const body = (await request.json()) as Pick<Payload, 'id' | 'message'>
		const payload = createPayload(body, userId, username)

		await sendMessage(channel, payload)

		return json({ message: 'Message sent.' }, { status: 201 })
	} catch (e) {
		return error(401, e as Error)
	} finally {
		await supabase.removeChannel(channel)
	}
}

export const PATCH: RequestHandler = async ({ cookies, params }) => {
	const session = cookies.get('session')

	if (!session) {
		error(401, 'Unauthorized.')
	}

	try {
		const { userId, username } = await verifyToken(session)

		await supabase
			.from('users')
			.update({ last_active: new Date().toISOString() })
			.eq('id', userId)
			.eq('room_id', params.id)
			.select()
			.single()
			.throwOnError()

		const { jwt, expires } = await createToken({ userId, username })

		cookies.set('session', jwt, {
			path: `/room/${params.id}`,
			expires
		})
	} catch {
		error(401, 'Unauthorized.')
	}

	return new Response(null, { status: 204 })
}

async function sendMessage(channel: RealtimeChannel, payload: Payload): Promise<void> {
	const response = await channel.send({
		type: 'broadcast',
		event: 'message',
		payload
	})

	if (response !== 'ok') {
		throw Error('Failed to send message.')
	}
}

function createPayload(
	body: Pick<Payload, 'id' | 'message'>,
	userId: string,
	username: string
): Payload {
	try {
		const { id, message } = newMessageSchema.parse({
			id: body.id,
			message: body.message
		})

		return { type: 'payload', id, message, userId, username }
	} catch {
		throw Error('Invalid ID or message.')
	}
}

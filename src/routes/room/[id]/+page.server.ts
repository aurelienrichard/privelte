import { redirect } from '@sveltejs/kit'
import { verifyUser } from '$lib/server/auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, cookies }) => {
	const session = cookies.get('session')

	try {
		const { userId, username } = await verifyUser(session, params.id)

		return {
			title: `${params.id}`,
			userId,
			username
		}
	} catch {
		return redirect(302, `/room/${params.id}/join`)
	}
}

import { writable, derived } from 'svelte/store'

export const createPendingMessages = () => {
	const { subscribe, update } = writable<Map<string, 'loading' | 'error'>>(new Map())

	return {
		subscribe,
		setStatus: (id: string, status: 'loading' | 'error' | 'success') =>
			update((map) => {
				if (status === 'success') {
					map.delete(id)
				} else if (status === 'error' || status === 'loading') {
					map.set(id, status)
				}
				return map
			})
	}
}

export const pendingMessages = createPendingMessages()

export const createUnreadMessagesCount = () => {
	const { subscribe, update, set } = writable<number>(0)

	return {
		subscribe,
		increment: () => update((value) => (value < 100 ? value + 1 : value)),
		reset: () => set(0)
	}
}

export const unreadMessagesCount = createUnreadMessagesCount()

export const unreadMessages = derived(unreadMessagesCount, ($unreadMessagesCount) => {
	const strValue = String($unreadMessagesCount)

	switch ($unreadMessagesCount) {
		case 0:
			return ''
		case 100:
			return '(99+)'
		default:
			return `(${strValue})`
	}
})

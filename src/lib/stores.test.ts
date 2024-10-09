import { test, expect, describe } from 'vitest'
import { createPendingMessages } from './stores'

describe('Pending messages store', () => {
	const id = '1'

	test('should set status to loading', () => {
		const { subscribe, setStatus } = createPendingMessages()
		const status = 'loading'

		setStatus(id, status)

		subscribe((map) => {
			expect(map.get(id)).toBe(status)
		})
	})

	test('should set status to error', () => {
		const { subscribe, setStatus } = createPendingMessages()
		const status = 'error'

		setStatus(id, status)

		subscribe((map) => {
			expect(map.get(id)).toBe(status)
		})
	})

	test('should set status to success and remove from map', () => {
		const { subscribe, setStatus } = createPendingMessages()

		setStatus(id, 'loading')
		setStatus(id, 'success')

		subscribe((map) => {
			expect(map.has(id)).toBeFalsy()
		})
	})
})

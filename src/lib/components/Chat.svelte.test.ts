import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Chat from '$lib/components/Chat.svelte'
import type { Payload, Presence } from '$lib/types/types'

describe('Chat component', () => {
	const userId = '1'

	test('should render share link message and clipboard component', () => {
		const { getByRole } = render(Chat, { userId, entries: [], subscribed: 'ok' })

		expect(getByRole('heading', { level: 1 })).toBeInTheDocument()
		expect(getByRole('button', { name: 'Copy to clipboard.' })).toBeInTheDocument()
	})

	test('should display loading message when subscription is loading', () => {
		const { getByText } = render(Chat, { userId, entries: [], subscribed: 'loading' })

		expect(getByText('Connecting...')).toBeInTheDocument()
	})

	test('should display error message when subscription failed', () => {
		const { getByText } = render(Chat, { userId, entries: [], subscribed: 'error' })

		expect(getByText('Could not connect to the room.')).toBeInTheDocument()
	})

	test('should display welcome message when subscribed is true', () => {
		const { getByText } = render(Chat, { userId, entries: [], subscribed: 'ok' })

		expect(getByText('Welcome to the room.')).toBeInTheDocument()
	})

	test('should render presence message when entry type is presence', () => {
		const joinedPresence: Presence = {
			type: 'presence',
			username: 'test1',
			event: 'joined',
			id: '1'
		}
		const leftPresence: Presence = {
			type: 'presence',
			username: 'test2',
			event: 'left',
			id: '2'
		}

		const { getByText } = render(Chat, {
			userId,
			entries: [joinedPresence, leftPresence],
			subscribed: 'ok'
		})

		expect(getByText('test1')).toBeInTheDocument()
		expect(getByText('test2')).toBeInTheDocument()
		expect(getByText('has joined the room.')).toBeInTheDocument()
		expect(getByText('has left the room.')).toBeInTheDocument()
	})

	test('renders Message component when entry type is payload', () => {
		const payload: Payload = {
			type: 'payload',
			userId,
			id: '1',
			message: 'Hello World',
			username: 'John'
		}

		const { getByText } = render(Chat, { entries: [payload], userId, subscribed: 'ok' })

		expect(getByText('Hello World')).toBeInTheDocument()
	})
})

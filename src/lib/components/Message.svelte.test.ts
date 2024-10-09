import { describe, test, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import Message from './Message.svelte'
import type { Payload } from '$lib/types/types'

describe('Message component', () => {
	const payload: Payload = {
		type: 'payload',
		message: 'Hello World',
		userId: '1',
		username: 'John',
		id: '2'
	}

	test('should display the message and username', () => {
		const { getByText } = render(Message, { payload, status: 'success', isOwnMessage: false })

		expect(getByText('John')).toBeInTheDocument()
		expect(getByText('Hello World')).toBeInTheDocument()
	})

	test('should render the loading state', () => {
		const { getByText, getByTestId } = render(Message, {
			payload,
			status: 'loading',
			isOwnMessage: true
		})

		expect(getByText('John')).toBeInTheDocument()
		expect(getByTestId('progress-radial')).toBeInTheDocument()
	})

	test('should render the error state', () => {
		const { getByText, getByRole } = render(Message, {
			payload,
			status: 'error',
			isOwnMessage: true
		})

		expect(getByText('Undelivered')).toBeInTheDocument()
		expect(getByRole('button', { name: 'Retry.' })).toBeInTheDocument()
	})

	test('should render the success state', () => {
		const { getByText, getByTestId } = render(Message, {
			payload,
			status: 'success',
			isOwnMessage: true
		})

		expect(getByText('John')).toBeInTheDocument()
		expect(getByTestId('success-icon')).toBeInTheDocument()
	})

	test('should call the retry event when retry button is clicked', async () => {
		const user = userEvent.setup()
		const onRetry = vi.fn()

		const { getByRole, component } = render(Message, {
			payload,
			status: 'error',
			isOwnMessage: true
		})

		component.$on('retry', onRetry)

		await user.click(getByRole('button', { name: 'Retry.' }))

		expect(onRetry).toHaveBeenCalled()
	})
})

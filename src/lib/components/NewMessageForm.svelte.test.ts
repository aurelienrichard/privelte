import { describe, test, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/svelte'
import NewMessageForm from './NewMessageForm.svelte'

describe('New message form component', () => {
	const props = { roomId: '1' }

	test('should display placeholder text', () => {
		const { getByPlaceholderText } = render(NewMessageForm, props)

		expect(getByPlaceholderText(`Message @${props.roomId}`)).toBeInTheDocument()
	})

	test('submit button should be disabled when textarea is empty', () => {
		const { getByRole } = render(NewMessageForm, props)

		const textarea = getByRole('textbox')

		expect(textarea).toHaveValue('')
		expect(getByRole('button', { name: 'Send.' })).toBeDisabled()
	})

	test('typing in the textarea should enable the submit button', async () => {
		const { getByRole } = render(NewMessageForm, props)

		const textarea = getByRole('textbox')
		const submitButton = getByRole('button', { name: 'Send.' })

		await userEvent.type(textarea, 'Hello World')

		expect(textarea).toHaveValue('Hello World')
		expect(submitButton).toBeEnabled()
	})

	describe('should handle new message submission', () => {
		const user = userEvent.setup()
		const event = expect.objectContaining({
			detail: {
				id: expect.any(String) as string,
				message: 'Hello World'
			}
		}) as CustomEvent

		let onMessage: Mock
		let textarea: HTMLElement
		let submitButton: HTMLElement

		beforeEach(() => {
			onMessage = vi.fn()
			const { getByRole, component } = render(NewMessageForm, props)

			component.$on('message', onMessage)
			textarea = getByRole('textbox')
			submitButton = getByRole('button', { name: 'Send.' })
		})

		test('by clicking the submit button', async () => {
			await user.type(textarea, 'Hello World')
			await user.click(submitButton)

			expect(onMessage).toHaveBeenCalledWith(event)
			expect(textarea).toHaveValue('')
		})

		test('by pressing the enter key', async () => {
			await user.type(textarea, 'Hello World')
			await user.keyboard('{Enter}')

			expect(onMessage).toHaveBeenCalledWith(event)
			expect(textarea).toHaveValue('')
		})
	})
})

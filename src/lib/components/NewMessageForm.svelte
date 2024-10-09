<script lang="ts">
	import { createEventDispatcher, afterUpdate, onMount } from 'svelte'
	import { nanoid } from 'nanoid'

	export let roomId: string

	let textarea: HTMLTextAreaElement
	let message = ''

	$: disabled = !message || /^[\s]+$/.test(message)

	const dispatch = createEventDispatcher()

	onMount(() => {
		textarea.focus()
	})

	afterUpdate(() => {
		setHeight()
	})

	function setHeight() {
		if (textarea) {
			textarea.style.height = '40px'
			textarea.style.height = `${textarea.scrollHeight}px`
		}
	}

	function handleMessage() {
		const id = nanoid()

		dispatch('message', { message, id })
		message = ''
	}
</script>

<div
	class="input-group input-group-divider dark:focus-within:border-primary-500 mt-auto grid-cols-[1fr_auto] focus-within:border-indigo-500 [&>div]:p-0"
>
	<div class="flex items-start">
		<textarea
			on:keydown={(e) => {
				if (e.key === 'Enter' && !e.shiftKey) {
					e.preventDefault()
					if (!disabled) {
						handleMessage()
					}
				}
			}}
			bind:this={textarea}
			bind:value={message}
			class="h-10 max-h-28 grow resize-none border-0 bg-transparent ring-0"
			name="message"
			placeholder={`Message @${roomId}`}
			maxlength="1000"
			rows="1"
		/>
	</div>
	<button
		{disabled}
		title="Send."
		type="submit"
		class="dark:from-primary-700 dark:to-primary-700 bg-gradient-to-br from-indigo-400 to-pink-400 transition-opacity disabled:opacity-50 disabled:hover:cursor-not-allowed"
		on:click={handleMessage}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="h-6 w-6"
		>
			<path
				d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
			/>
		</svg>
	</button>
</div>

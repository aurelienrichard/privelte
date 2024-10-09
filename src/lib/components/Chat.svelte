<script lang="ts">
	import { afterUpdate } from 'svelte'
	import { ProgressRadial } from '@skeletonlabs/skeleton'
	import Message from './Message.svelte'
	import { pendingMessages, unreadMessagesCount } from '$lib/stores'
	import { page } from '$app/stores'
	import type { Payload, Presence } from '$lib/types/types'
	import Clipboard from './Clipboard.svelte'

	export let entries: (Payload | Presence)[] = []
	export let userId: string
	export let subscribed: 'loading' | 'ok' | 'error'

	let bottom: HTMLDivElement
	let scrollable: HTMLDivElement

	$: getStatus = (id: string) => {
		if (!$pendingMessages.get(id)) {
			return 'success'
		}

		const status = $pendingMessages.get(id)!

		return status
	}

	$: isScrolledToBottom = () => {
		if (!scrollable) return false
		return scrollable.scrollHeight - scrollable.scrollTop - scrollable.clientHeight < 1
	}

	afterUpdate(() => {
		bottom.scrollIntoView?.({ behavior: 'smooth' })
	})
</script>

<svelte:window
	on:focus={() => {
		if (isScrolledToBottom()) {
			unreadMessagesCount.reset()
		}
	}}
/>

<div
	bind:this={scrollable}
	on:scrollend={() => {
		if (isScrolledToBottom()) {
			unreadMessagesCount.reset()
		}
	}}
	class="absolute left-0 top-0 h-full w-full space-y-4 overflow-y-auto overflow-x-clip px-4"
>
	<h1 class="h2 text-surface-600-300-token mb-3 text-center leading-snug md:mb-6">
		Share the link
		<span
			class="dark:from-gradient-1-dark dark:to-gradient-2-dark from-gradient-1-light to-gradient-2-light bg-gradient-to-br box-decoration-clone bg-clip-text capitalize text-transparent"
			>below</span
		>
		to invite
		<span
			class="dark:from-gradient-1-dark dark:to-gradient-2-dark from-gradient-1-light to-gradient-2-light bg-gradient-to-br box-decoration-clone bg-clip-text capitalize text-transparent"
			>participants</span
		>.
	</h1>
	<Clipboard url={$page.url} />
	<hr class="my-4" />
	<div class="text-surface-600-300-token">
		{#if subscribed === 'ok'}
			<p class="text-center">Welcome to the room.</p>
		{:else if subscribed === 'error'}
			<p class="flex items-center justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mr-1 h-5 w-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
					/>
				</svg>
				Could not connect to the room.
			</p>
		{:else}
			<div class="text-surface-600-300-token flex items-center justify-center">
				<ProgressRadial
					width="w-4 h-4 mr-1"
					track="dark:stroke-surface-100/30 stroke-surface-800/30"
				/>
				Connecting...
			</div>
		{/if}
	</div>
	{#each entries as entry (entry.id)}
		{#if entry.type === 'presence'}
			<p class="text-surface-600-300-token">
				<span class="font-semibold">{entry.username}</span> has {entry.event} the room.
			</p>
		{:else}
			<Message
				on:retry
				payload={entry}
				status={getStatus(entry.id)}
				isOwnMessage={entry.userId === userId}
			/>
		{/if}
	{/each}
	<div bind:this={bottom} />
</div>

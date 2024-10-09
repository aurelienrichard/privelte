<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton'
	import { createEventDispatcher } from 'svelte'
	import type { Payload } from '$lib/types/types'

	export let payload: Payload
	export let status: 'loading' | 'error' | 'success'
	export let isOwnMessage: boolean

	const dispatch = createEventDispatcher()

	const handleRetry = () => {
		dispatch('retry', { message: payload.message, id: payload.id })
	}
</script>

<div
	class={`card max-w-prose space-y-2 break-words p-4 ${isOwnMessage ? 'dark:from-primary-700 dark:to-primary-700 ml-auto rounded-tr-none bg-gradient-to-br from-indigo-400 to-pink-400' : 'dark:variant-soft-tertiary variant-soft-surface mr-auto rounded-tl-none'}`}
>
	{#if isOwnMessage}
		<header class="flex items-center justify-center">
			<span class="font-semibold">{payload.username}</span>
			{#if status === 'loading'}
				<ProgressRadial width="ml-auto w-5 h-5 mr-[0.11rem]" />
			{:else if status === 'error'}
				<span class="dark:text-tertiary-600 text-tertiary-900 ml-auto mr-1 text-lg"
					>Undelivered</span
				>
				<button on:click={handleRetry} type="button" class="mr-[0.05rem]" title="Retry.">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="dark:text-tertiary-600 text-tertiary-900 h-[1.45rem] w-[1.45rem]"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
				</button>
			{:else if status === 'success'}
				<svg
					data-testid="success-icon"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="ml-auto h-[1.49rem] w-[1.49rem]"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			{/if}
		</header>
		<section class="">{payload.message}</section>
	{:else}
		<header class="text-lg font-semibold">
			{payload.username}
		</header>
		<section class="">{payload.message}</section>
	{/if}
</div>

<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import type { SubmitFunction } from './$types'

	let loading = false

	let input: HTMLInputElement

	const handleSubmit: SubmitFunction = () => {
		loading = true
		return async ({ update }) => {
			await update()
			loading = false
		}
	}

	onMount(() => {
		input.focus()
	})
</script>

<div class="mb-6 text-center md:mb-8">
	<h1 class="h2 text-surface-600-300-token mb-3 leading-snug md:mb-6">
		Choose a
		<span
			class="dark:from-gradient-1-dark dark:to-gradient-2-dark from-gradient-1-light to-gradient-2-light bg-gradient-to-br box-decoration-clone bg-clip-text capitalize text-transparent"
			>username</span
		>.
	</h1>
	<p class="md:text-xl">Usernames are exclusive to their respective rooms.</p>
</div>

<form method="POST" use:enhance={handleSubmit}>
	<div
		class="input-group input-group-divider [&_input]:bg-surface-100-800-token dark:focus-within:border-primary-500 grid-cols-[1fr_auto] focus-within:border-indigo-500"
	>
		<input
			bind:this={input}
			type="text"
			name="username"
			minlength="3"
			maxlength="20"
			placeholder="Username"
			required
		/>
		<button
			type="submit"
			class="btn dark:variant-soft-tertiary variant-soft-surface rounded-l-none"
			title="Let's chat!"
			disabled={loading}
		>
			{#if loading}
				<ProgressRadial width="w-6" />
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			{/if}
		</button>
	</div>
</form>

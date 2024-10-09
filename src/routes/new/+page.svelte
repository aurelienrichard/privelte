<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton'
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import type { PageData, SubmitFunction } from './$types'

	export let data: PageData
	let slots = 10
	let loading = false

	const handleSubmit: SubmitFunction = () => {
		loading = true
		return async ({ update }) => {
			await update()
			loading = false
		}
	}
</script>

<h1 class="h2 text-surface-600-300-token mb-6 text-center leading-snug md:mb-8">
	Create a new
	<span
		class="dark:from-gradient-1-dark dark:to-gradient-2-dark from-gradient-1-light to-gradient-2-light bg-gradient-to-br box-decoration-clone bg-clip-text capitalize text-transparent"
		>room</span
	>.
</h1>

<form method="POST" use:enhance={handleSubmit}>
	<div class="grid gap-3 md:grid-cols-2 md:gap-6">
		<label class="label capitalize">
			<span>identifier</span>
			<div
				class="input-group input-group-divider [&_input]:bg-surface-100-800-token dark:focus-within:border-primary-500 grid-cols-[1fr_auto] focus-within:border-indigo-500"
			>
				<input type="text" name="id" value={data.id} readonly />
				<button
					type="button"
					on:click={async () => {
						await invalidateAll()
					}}
					class="btn dark:variant-soft-tertiary variant-soft-surface rounded-l-none"
					title="Generate a new identifier."
				>
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
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
				</button>
			</div>
		</label>

		<label class="label capitalize">
			<span
				><span
					class="h2 dark:from-gradient-1-dark dark:to-gradient-2-dark from-gradient-1-light to-gradient-2-light bg-gradient-to-br box-decoration-clone bg-clip-text text-transparent"
					>{slots}</span
				> slots</span
			>
			<input type="range" name="slots" bind:value={slots} min="2" max="10" />
		</label>
	</div>
	<div class="mt-6 flex md:mt-8">
		<button
			disabled={loading}
			type="submit"
			class="btn md:btn-lg dark:from-primary-700 dark:to-primary-700 mx-auto bg-gradient-to-br from-indigo-400 to-pink-400 font-semibold capitalize"
		>
			{#if loading}
				Submitting
				<ProgressRadial class="ml-1" width="md:w-5 w-4" />
			{:else}
				Next
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="ml-1 h-5 w-5 md:h-6 md:w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg></span
				>
			{/if}
		</button>
	</div>
</form>

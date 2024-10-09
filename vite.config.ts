import { sveltekit } from '@sveltejs/kit/vite'
import { purgeCss } from 'vite-plugin-tailwind-purgecss'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit(), purgeCss()],
	resolve: {
		conditions: mode === 'test' ? ['browser'] : []
	},
	test: {
		include: ['src/**/*.test.ts'],
		environmentMatchGlobs: [['**/*.svelte.test.ts', 'happy-dom']],
		setupFiles: ['./src/vitest-setup.ts']
	}
}))

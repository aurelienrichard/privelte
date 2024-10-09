<script lang="ts">
	import { page } from '$app/stores'
</script>

<div class="text-center">
	<h1
		class="h1 dark:from-gradient-1-dark dark:to-gradient-2-dark from-gradient-1-light to-gradient-2-light mb-1 bg-gradient-to-br box-decoration-clone bg-clip-text leading-snug text-transparent md:mb-2"
	>
		{$page.status}
	</h1>
	<p class="md:text-xl">
		{$page.error?.message}
	</p>
</div>

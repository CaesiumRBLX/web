<script lang="ts">
	import { Plus } from "lucide-svelte";
</script>

<div class="flex flex-row gap-2">
	<h2 class="h2 w-full"><strong>Select a workspace</strong></h2>
	<a class="btn variant-filled-primary" href="/workspace/new">
		<span><Plus /></span>
		<span>New workspace</span>
	</a>
</div>

<div class="grid grid-repeat w-full mt-8">
	{#each Array(15).fill(0) as item, i}
		<a class="card card-hover p-4" href="/">
			aaaaaa
		</a>
	{/each}
</div>

<style>
	.grid-repeat {
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1rem;
	}

	
</style>
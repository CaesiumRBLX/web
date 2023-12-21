<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";
	import { clipboard } from '@skeletonlabs/skeleton';
	import { fly, fade } from "svelte/transition"
	import { ClipboardCopy } from "lucide-svelte";
	import type { ActionData } from "../$types";

	export let data: PageData;
	export let form: ActionData;

	let tooltipVisible = false;
	
	function showTooltip() {
		if (!window.isSecureContext) return
		tooltipVisible = true
		setTimeout(()=>{tooltipVisible = false}, 1000)
	}
</script>

<form method="post" use:enhance>
	<header class="card-header">
		<h5 class="h5">Welcome, {data.username}!</h5>
		<h6 class="h6">Let's get you verified</h6>
	</header>
	<section class="p-4 space-y-4">
		<p class="my-2">Put the following emojis in your Roblox profile's "About Me" section and hit "Next"</p>
		<div class="grid grid-flow-col grid-cols-[1fr_auto] gap-2">
			<div class="input p-2">
				<p class="text-lg tracking-widest text-center">{data.verifyString}</p>
			</div>
			<div class="relative inline-block">
				{#if tooltipVisible}
					<span
						class="badge variant-filled-success absolute tooltip"
						in:fly={{ y: 20, duration: 500}} out:fade>Copied!</span>
				{/if}
				<button
					use:clipboard={data.verifyString}
					type="button" class="btn variant-soft"
					on:click={showTooltip}><ClipboardCopy /></button>
			</div>
		</div>
		{#if form?.message}
			<p class="text-error-500">{form.message}</p>
		{/if}
		<div class="text-right">
			<button type="submit" class="btn variant-filled-primary">Next</button>
		</div>
	</section>
</form>

<style>
	.tooltip {
		transform: translate(-50%, calc(-100% - 0.25rem));
		left: 50%;
	}
</style>
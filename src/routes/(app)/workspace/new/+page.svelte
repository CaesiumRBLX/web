<script lang="ts">
	import { fade } from "svelte/transition";
	import { Stepper, Step, ProgressBar, popup, ListBox, ListBoxItem } from "@skeletonlabs/skeleton";
	import type { PopupSettings } from "@skeletonlabs/skeleton";
	import { ChevronDown } from "lucide-svelte";

	let groupId: number;
	let groupIdValid = false;
	$: groupIdValid = typeof(groupId) == "number" && groupId > 0

	let loadingRoleData = true
	let selectedRank: number

	const popupListbox: PopupSettings = {
		event: 'focus-click',
		target: 'popupListbox',
		closeQuery: '.listbox-item'
	};

	function onNextHandler(e: {detail: {state: {current: number, total: number}, step: number}}): void {
		if (e.detail.state.current == 2) {

		}
	}
</script>

<h2 class="h2 inline"><strong>New workspace</strong></h2>

<div class="card mt-8 mx-auto p-4 max-w-3xl">
	<Stepper on:next={onNextHandler}>
		<Step transitionIn={fade} transitionOut={fade} locked={!groupIdValid}>
			<svelte:fragment slot="header">Let's get started!</svelte:fragment>
			First, we'll need the <strong>Roblox ID</strong> of the group. It's the set of numbers in a group's link, like so:
			<p class="code inline-block">https://roblox.com/groups/<strong>XXXXXXX</strong>/my-epic-group</p>
			
			<label class="label pb-2">
				<span>Group ID</span>
				<input class="input small" title="Group ID" type="number" placeholder="XXXXXXX" bind:value={groupId} />
			</label>
		</Step>
		<Step transitionIn={fade} transitionOut={fade}>
			<svelte:fragment slot="header">Role setup</svelte:fragment>
			{#if loadingRoleData}
				<div class="py-2">
					<ProgressBar />
				</div>
			{:else}
				<button class="btn variant-filled w-48 justify-between" use:popup={popupListbox}>
					<span>{selectedRank ?? 'Select role'}</span>
					<span><ChevronDown /></span>
				</button>
				<div class="card w-48 shadow-xl" data-popup="popupListbox">
					<ListBox rounded="rounded-none">
						<ListBoxItem bind:group={selectedRank} name="medium" value="books">Books</ListBoxItem>
						<ListBoxItem bind:group={selectedRank} name="medium" value="movies">Movies</ListBoxItem>
						<ListBoxItem bind:group={selectedRank} name="medium" value="television">TV</ListBoxItem>
					</ListBox>
					
				</div>
			{/if}
		</Step>
	</Stepper>
</div>

<style>
	.code {
		font-size: 1rem;
		color: var(--theme-font-color-base);
	}

	.small {
		max-width: 15rem;
		display: block;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type=number] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
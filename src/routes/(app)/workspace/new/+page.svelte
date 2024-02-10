<script lang="ts">
	import { fade } from "svelte/transition";
	import { goto } from "$app/navigation";
	import { Stepper, Step, ProgressBar, popup, ListBox, ListBoxItem } from "@skeletonlabs/skeleton";
	import type { PopupSettings } from "@skeletonlabs/skeleton";
	import { ChevronDown } from "lucide-svelte";

	let groupId: number;
	let groupIdValid = false;
	$: groupIdValid = typeof(groupId) == "number" && groupId > 0

	let loadingRoleData = true
	let selectedRank: number | undefined
	let roles: { name: string, memberCount?: number, rank: number, id: number}[]

	let errmessage: string

	const popupListbox: PopupSettings = {
		event: 'focus-click',
		target: 'popupListbox',
		closeQuery: '.listbox-item'
	};

	function rankToName(rank?: number) {
		if (!rank) return "Select role"
		for (let role of roles) {
			if (role.rank == rank) return role.name
		}
		return undefined
	}

	async function loadRoleData(id: number) {
		loadingRoleData = true
		selectedRank = undefined
		const res = await fetch(`/workspace/new/getGroupRoles/${id}`)
		roles = await res.json()
		loadingRoleData = false
	}

	function onNextHandler(e: {detail: {state: {current: number, total: number}, step: number}}): void {
		if (e.detail.state.current == 1) {
			loadRoleData(groupId)
		}
	}

	async function onCompleteHandler(e: Event) {
		const data = new FormData()
		data.append("groupId", groupId.toString())
		data.append("minRank", selectedRank!.toString())
		let res = await fetch("/workspace/new", {
			method: "POST",
			body: data
		}).catch(console.error)
		if (!res) return errmessage = "An error occured while creating the workspace"
		let resdata = await res.json()
		if (!res.ok) {
			errmessage = resdata.error.message
			return
		}
		if (resdata.type == "redirect") {
			goto(resdata.location)
		}
	}
</script>

<h2 class="h2 inline"><strong>New workspace</strong></h2>

<div class="card mt-8 mx-auto p-4 max-w-3xl">
	<Stepper on:next={onNextHandler} on:complete={onCompleteHandler}>
		<Step transitionIn={fade} transitionOut={fade} locked={!groupIdValid}>
			<svelte:fragment slot="header">Let's get started!</svelte:fragment>
			First, we'll need the <strong>Roblox ID</strong> of the group. It's the set of numbers in a group's link, like so:
			<p class="code inline-block">https://roblox.com/groups/<strong>XXXXXXX</strong>/my-epic-group</p>
			
			<label class="label pb-2">
				<span>Group ID</span>
				<input class="input small" title="Group ID" type="number" placeholder="XXXXXXX" bind:value={groupId} />
			</label>
		</Step>
		<Step transitionIn={fade} transitionOut={fade} locked={!selectedRank}>
			<svelte:fragment slot="header">Role setup</svelte:fragment>
			{#if loadingRoleData}
				<div class="py-2">
					<ProgressBar />
				</div>
			{:else}
				<p>Now, select the <strong>lowest</strong> role that can access this workspace</p>
				<button class="btn variant-filled w-fit justify-between" use:popup={popupListbox}>
					<span>{rankToName(selectedRank)}</span>
					<span><ChevronDown /></span>
				</button>
				<div class="card w-fit shadow-xl" data-popup="popupListbox">
					<ListBox rounded="rounded-none">
						{#each roles as role}
							<ListBoxItem bind:group={selectedRank} name="medium" value={role.rank}>{role.name}</ListBoxItem>
						{/each}
					</ListBox>
				</div>
			{/if}
		</Step>
		<Step transitionIn={fade} transitionOut={fade}>
			<svelte:fragment slot="header">Almost done!</svelte:fragment>
			You're ready to get started with Caesium! Just a few things to note:
			<ul>
				<li>You will automatically be assigned as the owner of this workspace. You can always transfer ownership to someone else, granted they are in the workspace too</li>
				<li>All roles (except from Guest) from your roblox group will be automatically imported</li>
			</ul>
			{#if errmessage}
				<p class="text-error-500">{errmessage}</p>
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
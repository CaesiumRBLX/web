<script lang="ts">
	import "../../app.css"
	import { AppShell, AppBar, Avatar, storePopup } from '@skeletonlabs/skeleton';
	import type { LayoutData } from "./$types";
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	//needed for popups
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data: LayoutData
</script>

<AppShell>
	<svelte:fragment slot="header">
		<div class="app-bar bg-surface-100-800-token space-y-4 p-2">
			<div class="lg:px-48 md:px-32 sm:px-20 xs:px-9 px-8">
			<div class=" flex flex-row justify-between items-center w-full mx-auto">
				<div class="w-10">
					<h3 class="h3 inline-block my-auto"><strong>Caesium</strong></h3>
				</div>

				<button class="btn bg-initial">
					<span><Avatar src={data.thumbnail} width="w-8" /></span>
					<span>{data.displayName}</span>
				</button>
			</div>
			</div>
		</div>
	</svelte:fragment>

	<div class="lg:px-48 md:px-32 sm:px-20 xs:px-9 px-8 pt-6">
		<slot />
	</div>
</AppShell>
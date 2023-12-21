<script lang="ts">
	import { enhance } from '$app/forms';
	import { AlertTriangle, Eye, EyeOff } from 'lucide-svelte';
	import type { ActionData } from '../$types';

	export let form: ActionData

	let passwordVisible = false;
</script>

<form method="post" use:enhance>
	<header class="card-header space-y-2">
		<h5 class="h5">Set a secure password</h5>
		<div class="p-2 grid grid-flow-col grid-cols-[auto_auto] bg-warning-50 border border-warning-500 rounded-md">
			<AlertTriangle />
			<p>Do <strong><i><u>NOT</u></i></strong> use your Roblox password!</p>
		</div>
	</header>
	<section class="p-4 space-y-2">
		<label class="label">
			<p>Password</p>
			<div class="input-group input-group-divider grid-cols-[1fr_auto]">
				<input
					name="password"
					title="Password"
					type={passwordVisible ? "text" : "password"}
					placeholder="Type here..." />
				<button class="variant-soft" type="button"
					on:click={()=>{passwordVisible = !passwordVisible}}>
					{#if passwordVisible}
						<Eye />
					{:else}
						<EyeOff />
					{/if}
				</button>
			</div>
		</label>
		<label class="label">
			<span>Confirm password...</span>
			<input
				class="input"
				name="confirmpass"
				title="Confirm password"
				type={passwordVisible ? "text" : "password"}
				placeholder="Type here..." />
		</label>
		{#if form?.message}
			<p class="text-error-500">{form.message}</p>
		{/if}
		<div class="text-right">
			<button type="submit" class="btn variant-filled-primary">Finish</button>
		</div>
	</section>
</form>
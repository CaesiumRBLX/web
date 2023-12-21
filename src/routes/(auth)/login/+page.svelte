<script lang="ts">
	import { enhance } from "$app/forms"
	import type { ActionData } from "./$types";
	import { Eye, EyeOff } from "lucide-svelte";

	export let form: ActionData

	let passwordVisible = false
</script>

<form method="post" use:enhance>
	<header class="card-header">
		<h3 class="h3">Login</h3>
	</header>
	<section class="p-4 space-y-2">
		<label class="label">
			<span>Username</span>
			<input
				class="input"
				name="username"
				title="Roblox username"
				type="text"
				placeholder="Type here..."
				value={form?.username ?? ""}/>
		</label>
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
		{#if form?.message}
			<p class="text-error-500">{form.message}</p>
		{/if}
		<div class="text-right">
			<button type="submit" class="btn variant-filled-primary">Next</button>
		</div>
	</section>
	<footer class="card-footer text-center">
		<p>Don't have an account? <a class="anchor" href="/register">Sign up</a></p>
	</footer>
</form>

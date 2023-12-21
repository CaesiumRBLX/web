<script lang="ts">
	import { enhance } from "$app/forms"
	import type { ActionData } from "./$types";

	export let form: ActionData
</script>

<form method="post" use:enhance>
	<header class="card-header">
		<h3 class="h3">Register</h3>
	</header>
	<section class="p-4 space-y-2">
		<label class="label">
			<span>Roblox username</span>
			<input
				class="input"
				name="username"
				title="Roblox username"
				type="text"
				placeholder="Type here..."
				value={form?.username ?? ""}/>
		</label>
		{#if form?.message}
			<p class="text-error-500">{form.message}</p>
		{/if}
		<div class="text-right">
			<button type="submit" class="btn variant-filled-primary">Next</button>
		</div>
	</section>
	<footer class="card-footer text-center">
		<p>Already signed up? <a class="anchor" href="/login">Login</a></p>
	</footer>
</form>

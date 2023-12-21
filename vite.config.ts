import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			"$drizzle": path.resolve(__dirname, "./drizzle")
		}
	},
	plugins: [sveltekit()]
});

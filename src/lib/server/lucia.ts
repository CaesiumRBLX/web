import { lucia } from "lucia";
import { postgres } from "@lucia-auth/adapter-postgresql";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { queryClient } from "./db";

export const auth = lucia({
	adapter: postgres(queryClient, {
		user: "user",
		session: "user_session",
		key: "user_key"
	}),
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),

	getUserAttributes: (data) => {
		return {
			robloxId: data.robloxId,
			username: data.username
		};
	}
});

export type Auth = typeof auth;
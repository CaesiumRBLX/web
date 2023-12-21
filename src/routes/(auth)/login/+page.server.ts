import { redirect, fail } from "@sveltejs/kit";
import noblox from "noblox.js";
import { auth } from "$lib/server/lucia";
import { LuciaError } from "lucia";

import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, "/");
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const username = formData.get("username");
		const password = formData.get("password");

		if (
			typeof username !== "string" ||
			username.length < 1 ||
			username.length > 20
		) {
			return fail(400, {
				username,
				message: "Invalid username"
			});
		}

		const nametrim = username.toString().trim()
		if (!nametrim || nametrim == "") return fail(400, { username, message: "Please enter a username" })

		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			return fail(400, {
				username,
				message: "Invalid password"
			});
		}

		const userId = await noblox.getIdFromUsername(nametrim)
			.catch(console.log)
		if (!userId || typeof(userId) != "number") return fail(404, { username, message: "Roblox user not found" })

		try {
			const key = await auth.useKey(
				"userid",
				userId.toString(),
				password
			);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === "AUTH_INVALID_KEY_ID" ||
					e.message === "AUTH_INVALID_PASSWORD")
			) {
				return fail(400, {
					username,
					message: "Incorrect username or password"
				});
			}
			return fail(500, {
				username,
				message: "An unknown error occurred"
			});
		}
		throw redirect(302, "/");
	}
}
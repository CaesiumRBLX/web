import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, "/login");

	await auth.invalidateSession(session.sessionId);
	locals.auth.setSession(null);
	throw redirect(302, "/login");
};
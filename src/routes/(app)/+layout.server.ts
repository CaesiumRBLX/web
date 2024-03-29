import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getThumbnail, getDisplayName } from "$lib/server/utils/userInfo";

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, "/login");
	
	const thumbnail = await getThumbnail(session.user.robloxId)
	const displayName = await getDisplayName(session.user.robloxId)
	return { user: session.user, thumbnail, displayName };
};
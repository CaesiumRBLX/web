import { error } from "@sveltejs/kit";
import { getRoles } from "$lib/server/utils/groupInfo.js";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params, locals }): Promise<Response> => {
	if (!locals.auth.validate()) {
		error(401, "Unauthorised")
	}

	if (!params.id) throw error(400, "Group ID missing")
	const id = parseInt(params.id)
	if (!id || isNaN(id)) throw error(400, "Invalid group ID")

	const roles = await getRoles(id)
	return new Response(JSON.stringify(roles), { status: 200 })
}
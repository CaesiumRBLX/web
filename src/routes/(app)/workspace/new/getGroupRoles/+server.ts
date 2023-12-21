import { error } from "@sveltejs/kit";
import { getRoles } from "$lib/server/utils/groupInfo.js";

export async function GET({ url, locals }) {
	if (!locals.auth.validate()) {
		error(401, "Unauthorised")
	}

	
}
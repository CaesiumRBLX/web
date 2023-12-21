import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import noblox, { message } from "noblox.js"
import { userFlowStarted, getUserFlowData, setUserVerified } from "$lib/server/registrationflow";

export const load: PageServerLoad = async ({locals, cookies}): Promise<{ username: string, verifyString: string }> => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, "/");

	const token = cookies.get("registrationFlow")
	if (!token) throw redirect(302, "/register")
	if (!userFlowStarted(token)) throw redirect(302, "/register")
	const flowData = getUserFlowData(token)
	console.log(flowData)
	if (flowData.verified) throw redirect(302, "/register/password")

	return { username: flowData.username, verifyString: flowData.verifyString }
}

export const actions: Actions = {
	default: async ({ cookies }) => {
		let token = cookies.get("registrationFlow")
		if (!token) throw redirect(302, "/register");
		if (!userFlowStarted(token)) throw redirect(302, "/register")
		const flowData = getUserFlowData(token)
		if (flowData.verified) throw redirect(302, "/register/password")

		let blurb = await noblox.getBlurb(flowData.userId)
			.catch(console.log)
		if (!blurb) return fail(404, { message: "Unable to fetch About Me" })

		if (blurb.toString().includes(flowData.verifyString)) {
			setUserVerified(token, true)
			throw redirect(302, "/register/password")
		} else {
			return fail(404, { message: "Verification failed. Please try again" })
		}
	}
}
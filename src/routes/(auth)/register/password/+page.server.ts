import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { userFlowStarted, getUserFlowData, finishUserFlow } from "$lib/server/registrationflow";
import { auth } from "$lib/server/lucia";

export const load: PageServerLoad = async ({ locals, cookies }): Promise<{}> => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, "/");

	const token = cookies.get("registrationFlow");
	if (!token) throw redirect(302, "/register");
	if (!userFlowStarted(token)) throw redirect(302, "/register");
	const flowData = getUserFlowData(token);
	if (!flowData.verified) throw redirect(302, "/register/verify");

	return {};
};

export const actions: Actions = {
	default: async ({ cookies, locals, request }) => {
		const token = cookies.get("registrationFlow");
		if (!token) throw redirect(302, "/register");
		if (!userFlowStarted(token)) throw redirect(302, "/register");
		const { username, userId } = getUserFlowData(token);

		const formData = await request.formData();
		const password = formData.get("password");
		const confirmPass = formData.get("confirmpass")
		
		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: "Invalid password"
			});
		}
		if (password != confirmPass) {
			return fail(400, {
				message: "Passwords do not match"
			});
		}
		try {
			const newUser = await auth.createUser({
				key: {
					providerId: "userid", // auth method
					providerUserId: userId.toString(), // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					username,
					robloxId: userId
				}
			});
			const session = await auth.createSession({
				userId: newUser.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
			finishUserFlow(token)
			cookies.delete("registrationFlow")
		} catch (e) {
			console.error(e)
			return fail(500, {
				message: "An error occured"
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, "/");
	}
};

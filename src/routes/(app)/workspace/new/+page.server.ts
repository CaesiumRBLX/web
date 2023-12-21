import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
	await parent()
	return {}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const username = formData.get("username");
		if (!username) return fail(400, { username, message: "Please enter a username" })
		const nametrim = username.toString().trim()
		if (!nametrim || nametrim == "") return fail(400, { username, message: "Please enter a username" })

		const userid = await noblox.getIdFromUsername(nametrim)
			.catch(console.log)
		if (!userid || typeof(userid) != "number") return fail(404, { username, message: "Roblox user not found" })

		const existing = await db.select().from(user).where(eq(user.robloxId, userid))
		if (existing.length > 0) return fail(409, { username, message: "User already registered. Login instead" })

		let regtoken = startUserFlow(nametrim, userid)
		cookies.set("registrationFlow", regtoken, { maxAge: 10*60 })
		throw redirect(302, "/register/verify")
	},
	getGroupRoles: async
}
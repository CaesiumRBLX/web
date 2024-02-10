import { redirect, error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { workspaces, roles, workspaceUsers } from "$drizzle/schema";
import { getRoles } from "$lib/server/utils/groupInfo";
import { getRankInGroup } from "noblox.js";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
	await parent()
	return {}
}

export const actions: Actions = {
	default: async ({ request,  locals }) => {
		const session = await locals.auth.validate()
		if (!session) throw error(401, "Unauthorised")

		const formData = await request.formData()
		const groupIdRaw = formData.get("groupId");
		if (!groupIdRaw) throw error(400, "No group ID provided")

		const groupId = parseInt(groupIdRaw.toString())
		if (!groupId || isNaN(groupId)) throw error(400, "Invalid group ID")

		const minRankRaw = formData.get("minRank");
		if (!minRankRaw) throw error(400, "No minimum rank provided")

		const minRank = parseInt(minRankRaw.toString())
		if (!minRank || isNaN(minRank)) throw error(400, "Invalid rank number")

		const existing = await db.select().from(workspaces).where(eq(workspaces.id, groupId))
		if (existing.length > 0) throw error(409, "Workspace already exists")

		const groupRoles = await getRoles(groupId)
		const dbroles = groupRoles.map((role) => ({
			id: role.id,
			workspaceId: groupId,
			name: role.name,
			rank: role.rank
		}))

		const userRank = await getRankInGroup(groupId, session.user.robloxId)
		if (userRank == 0) throw error(401, "You cannot create a workspace for a group in which you are not in")
		const userRole = dbroles.find((role) => role.rank == userRank)

		await db.transaction(async (tx) => {
			await tx.insert(workspaces).values({ id: groupId, ownerId: session.user.robloxId })
			await tx.insert(roles).values(dbroles)
			await tx.insert(workspaceUsers).values({
				userId: session.user.robloxId,
				workspaceId: groupId,
				roleId: userRole!.id
			})
		})

		throw redirect(302, `/workspace/${groupId}`)
	}
}
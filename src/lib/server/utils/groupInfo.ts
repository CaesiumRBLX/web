import noblox from "noblox.js"

interface Role {
	name: string;
	memberCount?: number;
	rank: number;
	id: number;
}

const roleCache: Map<number, { roles: Role[], cacheCreated: number }> = new Map()

export async function getRoles(groupId: number): Promise<Role[]> {
	const cachehit = roleCache.get(groupId)
	if (cachehit) {
		// if cached roles are from less than 10 minutes ago, return those
		if ((Math.abs(Date.now() - cachehit.cacheCreated) / (1000 * 60)) < 10) {
			return cachehit.roles
		} else {
			roleCache.delete(groupId)
		}
	}

	const roles: Role[] = await noblox.getRoles(groupId)
	roles.sort((a, b) => a.rank - b.rank)
	roles.splice(0,1)

	roleCache.set(groupId, { roles, cacheCreated: Date.now() })
	return roles
}

export function invalidateRoleCache(groupId: number): void {
	roleCache.delete(groupId)
}
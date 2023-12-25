import noblox from "noblox.js"

const thumbnailCache: Map<number, string> = new Map()
const displayNameCache: Map<number, string> = new Map()

export async function getThumbnail(userId: number): Promise<string | undefined> {
	if (thumbnailCache.has(userId)) {
		return thumbnailCache.get(userId)!
	}

	const thumbnail = await noblox.getPlayerThumbnail(userId, 720, "png", false, "headshot")
	if (thumbnail[0].state == "Completed") {
		const url = thumbnail[0].imageUrl!
		thumbnailCache.set(userId, url)
		return url
	}
	return
}

export async function getDisplayName(userId: number): Promise<string | undefined> {
	if (displayNameCache.has(userId)) {
		return displayNameCache.get(userId)!
	}

	const info = await noblox.getPlayerInfo(userId)
	displayNameCache.set(userId, info.displayName)
	return info.displayName
}
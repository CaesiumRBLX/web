import { randomBytes } from "crypto"

interface validationCache {
	username: string;
	userId: number;
	verifyString: string;
	verified: boolean
}

let cache: Map<string, validationCache> = new Map()

const emojis = ["🐕", "🐈", "🍇", "🍎", "🍊", "🏢", "🖥️", "💿", "💻", "📱", "🎤", "😀", "🙂", "✨", "🎉", "🎮", "♣️", "♦️", "♥️", "♠️"]

export function startUserFlow(username: string, userId: number): string {
	let token = randomBytes(64).toString("base64")
	let phrase = ""
	for (let i = 0; i < 8; i++) {
		phrase = phrase + emojis[Math.floor(Math.random()*emojis.length)]
	}
	cache.set(token, { username, userId, verifyString: phrase, verified: false })
	return token
}

export function userFlowStarted(token: string): boolean {
	return cache.has(token)
}

export function getUserFlowData(token: string): validationCache {
	if (!cache.has(token)) throw Error("No registration flow found")
	return cache.get(token)!
}

export function setUserVerified(token: string, status: boolean) {
	if (!cache.has(token)) throw Error("No registration flow found")
	let data = cache.get(token)!
	data.verified = status
	cache.set(token, data)
}

export function finishUserFlow(token: string) {
	if (!cache.has(token)) throw Error("No registration flow found")
	cache.delete(token)
}
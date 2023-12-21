// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			auth: import("lucia").AuthRequest;
		}
	}
	namespace Lucia {
		type Auth = import("$lib/server/lucia").Auth;
		type DatabaseUserAttributes = {
			robloxId: number;
			username: string;
		};
		type DatabaseSessionAttributes = {};
	}

	namespace NodeJS {
		interface ProcessEnv {
			[key: string]: string | undefined;
			DATABASE_URL: string
		}
	}
}

export {};

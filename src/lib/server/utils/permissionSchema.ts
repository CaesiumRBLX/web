type tPermissionSchema = {
		name: string;
		description: string;
		actions: {
			name: string;
			description: string;
			default: boolean;
			overrides?: string
		}[];
	}[];

const permissionSchema = [
	{
		name: "wall",
		description: "Wall",
		actions: [
			{ name: "view", description: "View wall posts", default: true },
			{ name: "create", description: "Create wall posts", default: true, overrides: "view" },
			{ name: "manage", description: "Manage wall posts", default: false, overrides: "create"}
		]
	},
	{
		name: "workspace",
		description: "Workspace",
		actions: [
			{ name: "manage", description: "Manage workspace", default: false}
		]
	}
 ] satisfies tPermissionSchema;

export default permissionSchema;

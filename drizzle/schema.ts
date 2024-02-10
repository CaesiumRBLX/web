import { pgTable, bigint, varchar, primaryKey, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("user", {
	id: varchar("id", {
		length: 15 // change this when using custom user ids
	}).primaryKey(),
	robloxId: bigint("robloxId", { mode: "number" })
		.notNull()
		.unique(),
	username: varchar("username", { length: 20 }).notNull()
});

export const UserRelations = relations(users, ({ many }) => ({
	workspaceUsers: many(workspaceUsers, { relationName: "workspaces" }),
	session: many(session, { relationName: "sessions" }),
	keys: many(key, { relationName: "keys" }),
	posts: many(posts, { relationName: "posts" })
}));

export const session = pgTable("user_session", {
	id: varchar("id", {
		length: 128
	}).primaryKey(),
	userId: varchar("user_id", { length: 15 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	activeExpires: bigint("active_expires", {
		mode: "number"
	}).notNull(),
	idleExpires: bigint("idle_expires", {
		mode: "number"
	}).notNull()
});

export const key = pgTable("user_key", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	userId: varchar("user_id", { length: 15 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	hashedPassword: varchar("hashed_password", {
		length: 255
	})
});

export const workspaceUsers = pgTable("workspace_users", {
	userId: bigint("user_id", { mode: "number" })
		.notNull()
		.references(() => users.robloxId, { onDelete: "cascade" }),
	workspaceId: bigint("workspace_id", { mode: "number" })
		.notNull()
		.references(() => workspaces.id, { onDelete: "cascade" }),
	roleId: bigint("role_id", { mode: "number" })
		.notNull()
		.references(() => roles.id)
}, (table) => ({
	pk: primaryKey({ columns: [table.userId, table.workspaceId] })
}));

export const workspaceUsersRelations = relations(workspaceUsers, ({ one }) => ({
	user: one(users, {
		fields: [workspaceUsers.userId],
		references: [users.robloxId]
	}),
	workspace: one(workspaces, {
		fields: [workspaceUsers.workspaceId],
		references: [workspaces.id]
	}),
	role: one(roles, {
		fields: [workspaceUsers.roleId],
		references: [roles.id]
	})
}));

export const workspaces = pgTable("workspaces", {
	id: bigint("id", { mode: "number" }).primaryKey(),
	ownerId: bigint("owner_id", { mode: "number" })
		.notNull()
		.references(() => users.robloxId)
});

export const workspaceRelations = relations(workspaces, ({ many, one }) => ({
	workspaceUsers: many(workspaceUsers, { relationName: "users" }),
	owner: one(users, {
		fields: [workspaces.ownerId],
		references: [users.id]
	}),
	roles: many(roles, { relationName: "roles" }),
	rolesets: many(rolesets, { relationName: "rolesets" }),
	posts: many(posts, { relationName: "posts" })
}));

export const roles = pgTable("roles", {
	id: bigint("id", { mode: "number" }).primaryKey(),
	workspaceId: bigint("workspace_id", { mode: "number" })
		.notNull().references(() => workspaces.id),
	name: varchar("name", { length: 100 }).notNull(),
	rank: integer("rank").notNull()
})

export const roleRelations = relations(roles, ({ one, many }) => ({
	workspace: one(workspaces, {
		fields: [roles.workspaceId],
		references: [workspaces.id]
	}),
	workspaceUsers: many(workspaceUsers)
}))

export const rolesets = pgTable("rolesets", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }),
	workspaceId: bigint("workspace_id", { mode: "number" })
		.notNull().references(() => workspaces.id, { onDelete: "cascade" }),
	minRole: bigint("min_role_id", { mode: "number" })
		.notNull().references(() => roles.id),
	maxRole: bigint("max_role_id", { mode: "number" })
		.notNull().references(() => roles.id)
})

export const posts = pgTable("wall_posts", {
	id: serial("id").primaryKey(),
	workspaceId: bigint("workspace_id", { mode: "number" })
		.notNull().references(() => workspaces.id, { onDelete: "cascade" }),
	authorId: bigint("author_id", { mode: "number" })
		.notNull().references(() => users.robloxId, { onDelete: "cascade"}),
	content: varchar("content", { length: 500 }).notNull(),
	postedAt: timestamp("posted_at", { mode: "date" })
		.defaultNow()
})

export const postRelations = relations(posts, ({ one }) => ({
	workspace: one(workspaces, {
		fields: [posts.workspaceId],
		references: [workspaces.id]
	}),
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id]
	})
}))
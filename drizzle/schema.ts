import { pgTable, bigint, varchar, boolean, primaryKey } from "drizzle-orm/pg-core";
import { Column, relations } from "drizzle-orm";

export const user = pgTable("user", {
	id: varchar("id", {
		length: 15 // change this when using custom user ids
	}).notNull().unique().primaryKey(),
	robloxId: bigint("robloxId", { mode: "number" })
		.notNull()
		.unique(),
	username: varchar("username", { length: 20 }).notNull()
});

export const UserRelations = relations(user, ({ many }) => ({
	usersToWorkspaces: many(usersToWorkspaces, { relationName: "workspaces" }),
	session: many(session, { relationName: "sessions" }),
	keys: many(key, { relationName: "keys" })
}));

export const session = pgTable("user_session", {
	id: varchar("id", {
		length: 128
	}).primaryKey(),
	userId: varchar("user_id", { length: 15 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
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
		.references(() => user.id, { onDelete: "cascade" }),
	hashedPassword: varchar("hashed_password", {
		length: 255
	})
});

export const usersToWorkspaces = pgTable("users_to_workspaces", {
	userId: bigint("user_id", { mode: "number" })
		.notNull()
		.references(() => user.robloxId),
	workspaceId: bigint("workspace_id", { mode: "number" })
		.notNull()
		.references(() => workspace.id)
}, (table) => ({
	pk: primaryKey({ columns: [table.userId, table.workspaceId] })
}));

export const usersToWorkspacesRelations = relations(usersToWorkspaces, ({ one }) => ({
	user: one(user, {
		fields: [usersToWorkspaces.userId],
		references: [user.robloxId]
	}),
	workspace: one(workspace, {
		fields: [usersToWorkspaces.workspaceId],
		references: [workspace.id]
	})
}));

export const workspace = pgTable("workspace", {
	id: bigint("id", { mode: "number" }).primaryKey(),
	ownerId: bigint("owner_id", { mode: "number" })
		.notNull()
		.references(() => user.robloxId)
});

export const workspaceRelations = relations(workspace, ({ many, one }) => ({
	usersToWorkspaces: many(usersToWorkspaces, { relationName: "users" }),
	owner: one(user)
}));

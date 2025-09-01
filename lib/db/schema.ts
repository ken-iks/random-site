import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const users = table(
    "users",
    {
        id: t.int().primaryKey({ autoIncrement: true }),
        firstName: t.text("first_name").notNull(),
        lastName: t.text("last_name"),
        userName: t.text("username").notNull(),
        hashedPassword: t.text("hashed_password").notNull(),
        role: t.text("role", { enum: ["admin", "regular"] }).default("regular"),
        bio: t.text("bio").notNull(),
        profilePicPath: t.text("profile_pic_path").default("public/defaultpic.jpg")
    },
    (table) => [ t.uniqueIndex("username_idx").on(table.userName) ]
);

export const posts = table(
    "posts",
    {
        id: t.int().primaryKey({ autoIncrement: true }),
        authorId: t.int().references(() => users.id),
        content: t.text("content").notNull(), //ideally markdown
        isPublished: t.integer("is_published", {mode: 'boolean'} ).notNull(),
        isArchived: t.integer("is_archived", {mode: 'boolean'} ).notNull(),
        likeCount: t.int("like_count").notNull(),
        viewCount: t.int("view_count").notNull(),
        lastEdited: t.integer("last_edited", { mode: 'timestamp' }).notNull()
    },
    (table) => [
        t.index("popularity_idx").on(table.viewCount, table.likeCount),
        t.index("recency_idx").on(table.lastEdited)
    ]
)
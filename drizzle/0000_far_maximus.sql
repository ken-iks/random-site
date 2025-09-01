CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`authorId` integer,
	`content` text NOT NULL,
	`is_published` integer NOT NULL,
	`is_archived` integer NOT NULL,
	`like_count` integer NOT NULL,
	`view_count` integer NOT NULL,
	`last_edited` integer NOT NULL,
	FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `popularity_idx` ON `posts` (`view_count`,`like_count`);--> statement-breakpoint
CREATE INDEX `recency_idx` ON `posts` (`last_edited`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text,
	`username` text NOT NULL,
	`hashed_password` text NOT NULL,
	`role` text DEFAULT 'regular',
	`bio` text NOT NULL,
	`profile_pic_path` text DEFAULT 'public/defaultpic.jpg'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `username_idx` ON `users` (`username`);
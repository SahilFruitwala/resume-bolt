CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`for_resume` integer,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`analysis_json` blob,
	`job_description` text NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

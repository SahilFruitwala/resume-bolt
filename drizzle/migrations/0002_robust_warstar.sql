ALTER TABLE `posts` RENAME TO `analysis`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_analysis` (
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
--> statement-breakpoint
INSERT INTO `__new_analysis`("id", "for_resume", "title", "company", "analysis_json", "job_description", "user_id", "created_at", "updated_at") SELECT "id", "for_resume", "title", "company", "analysis_json", "job_description", "user_id", "created_at", "updated_at" FROM `analysis`;--> statement-breakpoint
DROP TABLE `analysis`;--> statement-breakpoint
ALTER TABLE `__new_analysis` RENAME TO `analysis`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
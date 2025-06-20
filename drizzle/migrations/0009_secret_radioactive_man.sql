PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	`is_active` integer DEFAULT true,
	`credits_remaining` integer DEFAULT 0 NOT NULL,
	`subscription_plan_id` integer DEFAULT 1,
	FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "first_name", "last_name", "created_at", "updated_at", "is_active", "credits_remaining", "subscription_plan_id") SELECT "id", "email", "first_name", "last_name", "created_at", "updated_at", "is_active", "credits_remaining", "subscription_plan_id" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
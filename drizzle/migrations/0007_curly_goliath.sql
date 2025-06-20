CREATE TABLE `subscription_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`plan_name` text DEFAULT 'free' NOT NULL,
	`base_credit_allowance` integer NOT NULL,
	`reset_frequency` text DEFAULT 'none' NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` ADD `is_active` integer DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` ADD `credits_remaining` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_plan_id` integer REFERENCES subscription_plans(id);
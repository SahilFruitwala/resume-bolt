DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `analysis` ALTER COLUMN "analysis_json" TO "analysis_json" text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
ALTER TABLE `analysis` ADD `overall_score` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `analysis` ADD `total_insights` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `analysis` DROP COLUMN `updated_at`;
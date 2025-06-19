import { AnalysisDataType, CoverLetterAnalysisDataType } from "@/lib/types";
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, blob } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

export const analysis = sqliteTable("analysis", {
  id: integer("id").primaryKey(),
  forResume: integer("for_resume", { mode: "boolean" }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  analysisJson: blob("analysis_json", { mode: "json" }).$type<
    AnalysisDataType | CoverLetterAnalysisDataType
  >(),
  jobDescription: text("job_description").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});


export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertAnalysis = typeof analysis.$inferInsert;
export type SelectAnalysis = typeof analysis.$inferSelect;
import { AnalysisDataType, CoverLetterAnalysisDataType } from "@/lib/types";
import { sub } from "date-fns";
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, blob } from "drizzle-orm/sqlite-core";

export const creditResetFrequencyEnum = ["none", "daily", "monthly"] as const;
export type CreditResetFrequency = (typeof creditResetFrequencyEnum)[number];

export const subscriptionPlanEnum = ["free", "boost"] as const;
export type SubscriptionPlan = (typeof subscriptionPlanEnum)[number];

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  creditsRemaining: integer("credits_remaining").default(5).notNull(),
  subscriptionPlanId: integer("subscription_plan_id").references(
    () => subscriptionPlans.id
  ).default(1), // Foreign key to subscription_plans
});


export const subscriptionPlans = sqliteTable("subscription_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  planName: text("plan_name", {
    enum: subscriptionPlanEnum,
  })
    .notNull()
    .default("free"), // 'free', 'boost'
  baseCreditAllowance: integer("base_credit_allowance").notNull(),
  resetFrequency: text("reset_frequency", {
    enum: creditResetFrequencyEnum,
  })
    .notNull()
    .default("none"), // 'none', 'daily', 'monthly'
});

export const analysis = sqliteTable("analysis", {
  id: integer("id").primaryKey(),
  forResume: integer("for_resume", { mode: "boolean" }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  analysisJson: text('analysis_json', { mode: "json" }).$type<
    AnalysisDataType | CoverLetterAnalysisDataType
  >(),
  jobDescription: text("job_description").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  overallScore: integer("overall_score").notNull().default(0),
  totalInsights: integer("total_insights").notNull().default(0),
});


export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertAnalysis = typeof analysis.$inferInsert;
export type SelectAnalysis = typeof analysis.$inferSelect;
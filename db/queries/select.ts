import { asc, avg, count, desc, eq, max } from "drizzle-orm";
import { db } from "../index";
import { analysis, SelectAnalysis } from "../schema";

export async function getRecentAnalysis(
  userId: string,
  count: number = 5
): Promise<SelectAnalysis[]> {
  return db
    .select()
    .from(analysis)
    .orderBy(asc(analysis.createdAt))
    .where(eq(analysis.userId, userId))
    .limit(count);
}

export async function getPaginatedAnalysis(
  userId: string,
  page: number = 1,
  pageSize: number = 10
) {
  return db
    .select({
      id: analysis.id,
      createdAt: analysis.createdAt,
      forResume: analysis.forResume,
      title: analysis.title,
      score: analysis.overallScore,
      insights: analysis.totalInsights,
    })
    .from(analysis)
    .where(eq(analysis.userId, userId))
    .orderBy(asc(analysis.createdAt))
    .limit(pageSize)
}

export async function getDashboardData(userId: string) {
  return db
    .select({
       total: count(analysis.id),
       avgScore: avg(analysis.overallScore),
       maxScore:  max(analysis.overallScore),
      })
    .from(analysis)
    .where(eq(analysis.userId, userId))
    .orderBy(desc(analysis.overallScore));
}
import { and, asc, avg, count, desc, eq, max } from "drizzle-orm";
import { db } from "../index";
import { analysis, SelectAnalysis } from "../schema";
import { title } from "node:process";
import logger from "@/lib/logger";

export async function getRecentAnalysis(
  userId: string,
  count: number = 5
): Promise<SelectAnalysis[]> {
  logger.info(`Fetching recent analysis for user ${userId}`);
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
  logger.info(`Fetching paginated analysis for user ${userId}, page ${page}`);
  const result = await db
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
    .orderBy(desc(analysis.createdAt))
    .limit(pageSize + 1)
    .offset((page - 1) * pageSize);

  const hasMore = result.length > pageSize;
  return {
    recentAnalysis: hasMore ? result.slice(0, pageSize) : result,
    hasMore,
  };
}

export async function getAnalysisById(userId: string, analysisId: number) {
  logger.info(`Fetching analysis by ID ${analysisId} for user ${userId}`);
  const result = await db
    .select({
      id: analysis.id,
      createdAt: analysis.createdAt,
      forResume: analysis.forResume,
      analysis: analysis.analysisJson,
      title: analysis.title,
      overallScore: analysis.overallScore,
    })
    .from(analysis)
    .where(and(eq(analysis.id, analysisId), eq(analysis.userId, userId)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getDashboardData(userId: string) {
  logger.info(`Fetching dashboard data for user ${userId}`);
  return db
    .select({
      total: count(analysis.id),
      avgScore: avg(analysis.overallScore),
      maxScore: max(analysis.overallScore),
    })
    .from(analysis)
    .where(eq(analysis.userId, userId))
    .orderBy(desc(analysis.overallScore));
}

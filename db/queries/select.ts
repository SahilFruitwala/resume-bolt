import { asc, eq } from "drizzle-orm";
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
): Promise<SelectAnalysis[]> {
  return db
    .select()
    .from(analysis)
    .orderBy(asc(analysis.createdAt))
    .where(eq(analysis.userId, userId))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

import { db } from "@/db";
import { analysis, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";



export async function saveAnalysis(jobDescription: string, userId: string, title: string | undefined, company: string | undefined, analysisJson: any, forResume: boolean = true) {
    const dateSave = new Date()
    await db.transaction(async (tx) => {
        await tx.insert(analysis).values({
            forResume,
            title: title || `Unnamed Analysis - ${dateSave.toLocaleDateString()} ${dateSave.toLocaleTimeString()}`,
            company: company || "Unknown Company",
            analysisJson: analysisJson.object,
            jobDescription,
            userId,
            overallScore: analysisJson.object.overallScore,
            totalInsights: Object.keys(analysisJson.object.actionableRecommendations!)
                .length,
        });
        await tx
            .update(users)
            .set({
                creditsRemaining: sql`${users.creditsRemaining} - 1`,
            })
            .where(eq(users.id, userId));
    });

}
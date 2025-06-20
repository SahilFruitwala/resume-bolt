import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/db";
import { analysis } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { getDashboardData, getPaginatedAnalysis, getRecentAnalysis } from "@/db/queries/select";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const recentAnalysis = await getPaginatedAnalysis(userId, 1, 10);
    const result = recentAnalysis.map((item) => ({
      id: item.id,
      createdAt: new Date(item.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      forResume: item.forResume,
      title: item.title,
      insights: item.insights,
      score: item.score,
    }));

    await getDashboardData(userId)
    
    return Response.json(result);
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}

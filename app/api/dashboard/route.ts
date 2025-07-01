import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/db";
import { analysis } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { getDashboardData, getPaginatedAnalysis, getRecentAnalysis } from "@/db/queries/select";
import logger from "@/lib/logger";

export async function GET(request: Request) {
  logger.info("Dashboard data request received");
  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized request for dashboard data");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const recentAnalysis = await getRecentAnalysis(userId);
    const formatedRecentData = recentAnalysis.map((item) => ({
      id: item.id,
      createdAt: new Date(item.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      forResume: item.forResume,
      title: item.title,
      insights: Object.keys(item.analysisJson!.actionableRecommendations!)
        .length,
    }));

    // await getDashboardData(userId);

    logger.info("Recent Analysis Data:", formatedRecentData);


    return Response.json(formatedRecentData);
  } catch (error) {
    logger.error("Error during authentication:", error);
  }
}

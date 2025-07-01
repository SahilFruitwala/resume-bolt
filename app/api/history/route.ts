import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPaginatedAnalysis } from "@/db/queries/select";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  logger.info("Paginated analysis request received");
  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized request for paginated analysis");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const url = request.nextUrl;

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");

    if (!page || isNaN(Number(page))) {
      logger.warn("Invalid request for paginated analysis");
      return new NextResponse("Invalid request", { status: 403 });
    }
    
    const { recentAnalysis, hasMore } = await getPaginatedAnalysis(
      userId,
      Number(page),
      10
    );
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
    
    return NextResponse.json({result, hasMore});
  } catch (error) {
    logger.error("Error during authentication:", error);
  }
}

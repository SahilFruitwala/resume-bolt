import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAnalysisById, getPaginatedAnalysis } from "@/db/queries/select";
import logger from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  logger.info("Analysis by ID request received");
  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized request for analysis by ID");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const id = (await params).id;
    if (!id || isNaN(Number(id))) {
      logger.warn("Invalid request for analysis by ID");
      return new NextResponse("Invalid request", { status: 403 });
    }

    const data = await getAnalysisById(
      userId,
      Number(id)
    );

    return NextResponse.json({ data });
  } catch (error) {
    logger.error("Error during authentication:", error);
  }
}

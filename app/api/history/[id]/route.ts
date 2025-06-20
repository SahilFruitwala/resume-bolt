import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAnalysisById, getPaginatedAnalysis } from "@/db/queries/select";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  console.log("GET request for analysis by ID", params);
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const id = (await params).id;
    if (!id || isNaN(Number(id))) {
      return new NextResponse("Invalid request", { status: 403 });
    }

    const data = await getAnalysisById(
      userId,
      Number(id)
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}

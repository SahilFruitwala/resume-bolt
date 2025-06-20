import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPaginatedAnalysis } from "@/db/queries/select";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const {recentAnalysis, hasMore} = await getPaginatedAnalysis(userId, 1, 10);
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
    console.error("Error during authentication:", error);
  }
}

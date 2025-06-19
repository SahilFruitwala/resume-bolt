import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/db";
import { analysis } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { getPaginatedAnalysis, getRecentAnalysis } from "@/db/queries/select";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const recentAnalysis = await getPaginatedAnalysis(userId, 1, 10);
    console.log("Recent Analysis:", recentAnalysis);
    return Response.json(recentAnalysis);
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}

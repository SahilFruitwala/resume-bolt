import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/db";
import { analysis } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export const maxDuration = 60;

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const analysisSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall match score out of 100"),
  scoreJustification: z
    .string()
    .describe("Brief justification for the score in one sentence"),
  executiveSummary: z
    .string()
    .describe("2-3 sentence summary of candidate's suitability"),
  firstImpression: z.string().describe("Immediate impression the resume gives"),
  keywordAnalysis: z.object({
    matchingKeywords: z
      .array(z.string())
      .describe("Top 10-15 critical keywords present in resume"),
    missingKeywords: z
      .array(z.string())
      .describe("Top 10-15 critical keywords missing from resume"),
  }),
  atsAnalysis: z.object({
    redFlags: z.array(z.string()).describe("ATS parsing issues and red flags"),
    recommendations: z
      .array(z.string())
      .describe("Specific ATS compatibility improvements"),
  }),
  experienceAlignment: z.object({
    strengths: z
      .array(z.string())
      .describe("Strong matching experiences and skills with specific quotes"),
    gaps: z
      .array(z.string())
      .describe("Significant gaps in experience or skills"),
    dealBreakers: z
      .array(z.string())
      .describe("Critical missing qualifications"),
  }),
  actionableRecommendations: z.object({
    rewrittenSummary: z
      .string()
      .describe("New tailored professional summary for the candidate"),
    improvedBulletPoints: z
      .array(
        z.object({
          original: z.string().describe("Original bullet point"),
          improved: z
            .string()
            .describe("Improved STAR-method bullet point with metrics"),
        })
      )
      .describe("2-3 rewritten bullet points"),
    addressingGaps: z
      .array(z.string())
      .describe("Ways to address gaps and highlight transferable skills"),
  }),
  finalChecklist: z
    .array(z.string())
    .describe("3-5 most critical actions before submitting"),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File;
    const jobDescription = formData.get("jobDescription") as string;
    const company = formData.get("company") as string;
    const title = formData.get("title") as string;

    if (!resumeFile || !jobDescription) {
      return Response.json(
        { error: "Resume file and job description are required" },
        { status: 400 }
      );
    }

    if (resumeFile.type !== "application/pdf") {
      return Response.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const resumeBuffer = await resumeFile.arrayBuffer();

    const result = await generateObject({
      model: google("gemini-2.0-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a world-class career coach and expert resume analyst, specializing in Applicant Tracking Systems (ATS) and talent acquisition across a multitude of industries. Your goal is to provide a detailed, constructive, and highly actionable analysis of a candidate's resume against a specific job description. Your tone should be encouraging and empowering, aiming to help the candidate land an interview.

Job Description: ${jobDescription}

Please conduct a thorough analysis of the provided resume against the job description. Before you begin the detailed breakdown, start by summarizing your high-level understanding of the role's key requirements and the candidate's professional profile.

Then, provide the following comprehensive breakdown:

Resume Analysis Report

1. Overall Match Score: [Score]/100
- Provide a score from 0 to 100 that represents the resume's alignment with the job description.
- Briefly justify the score in one sentence.

2. Executive Summary & First Impression
- Provide a 2-3 sentence summary of the candidate's suitability for the role.
- What is the immediate impression this resume gives? (e.g., "Highly technical," "Strong leader," "Entry-level but high potential").

3. ATS & Keyword Optimization Analysis
Keyword Match:
- Matching Keywords: List the top 10-15 most critical keywords from the job description that ARE present in the resume.
- Missing Keywords: List the top 10-15 most critical keywords from the job description that ARE NOT present in the resume.

Formatting & Parsability:
- ATS Red Flags: Identify any elements that could cause parsing errors (e.g., tables, columns, headers/footers, non-standard fonts, images, text in graphics).
- Recommendations: Provide specific advice to improve ATS compatibility (e.g., "Convert the skills section from a table to a simple list," "Remove the headshot image").

4. Experience & Skills Alignment
Strengths & Relevant Experience:
- Clearly list the experiences and skills from the resume that are a strong match for the job requirements. Quote specific bullet points from the resume that are particularly effective.

Gaps & Areas for Improvement:
- Identify the most significant gaps in experience or skills based on the job description.
- Are there any "deal-breaker" qualifications that appear to be missing?

5. Actionable Recommendations for Improvement
Rewritten Professional Summary:
- Based on the job description, write a new, tailored 2-4 sentence professional summary for the candidate that they can use directly.

Impact-Oriented Bullet Points:
- Select 2-3 bullet points from the "Experience" section and rewrite them to be more results-oriented. Use the STAR (Situation, Task, Action, Result) method as a framework and incorporate quantifiable metrics where possible.

Addressing Gaps:
- Suggest concrete ways to rephrase existing experience or strategically reorder sections to better highlight transferable skills and de-emphasize gaps.
- If critical skills are truly missing, suggest how the candidate might address this.

6. Final Checklist for the Candidate
- Provide a final, concise checklist of 3-5 of the most critical actions the candidate should take before submitting this resume for the role.

IMPORTANT: Base your analysis entirely on the actual content of the provided resume and job description. Be specific, quote actual text from the resume, and provide actionable advice that the candidate can implement immediately.`,
            },
            {
              type: "file",
              data: resumeBuffer,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
      schema: analysisSchema,
      temperature: 0.1,
    });

    try {
      await db.insert(analysis).values({
        forResume: true,
        title : title || "Unnamed Analysis",
        company: company || "Unknown Company",
        analysisJson: result.object,
        jobDescription,
        userId,
      });
    } catch (dbError) {
      console.error("Failed to save analysis to database:", dbError);
      // Continue with response even if DB save fails
    }

    return Response.json(result.object);
  } catch (error) {
    console.error("Resume analysis error:", error);
    return Response.json(
      {
        error:
          "Failed to analyze resume. Please ensure your PDF is readable and try again.",
      },
      { status: 500 }
    );
  }
}

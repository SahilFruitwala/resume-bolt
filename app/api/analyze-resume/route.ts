import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/db";
import { analysis, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { saveAnalysis } from "@/db/queries/insert";
import logger from "@/lib/logger";

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
  logger.info("Resume analysis request received");
  try {
    const { userId } = await auth();
    // return NextResponse.json(
    //   { error: "You have no credits remaining. Please upgrade your plan." },
    //   { status: 403 }
    // );

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { creditRemaining } = (
      await db
        .select({ creditRemaining: users.creditsRemaining })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
    )[0];

    if (creditRemaining <= 0) {
      return NextResponse.json(
        { error: "You have no credits remaining. Please upgrade your plan." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File;
    const jobDescription = formData.get("jobDescription") as string;
    const company = formData.get("company") as string;
    const title = formData.get("title") as string;

    if (!resumeFile || !jobDescription) {
      return NextResponse.json(
        { error: "Resume file and job description are required" },
        { status: 400 }
      );
    }

    if (resumeFile.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const resumeBuffer = await resumeFile.arrayBuffer();
    const candidateContext = ''

    const result = await generateObject({
      model: google("gemini-2.0-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a world-class career coach and expert resume analyst with deep expertise in Applicant Tracking Systems (ATS) like Taleo, Workday, and iCIMS, and talent acquisition across industries (e.g., tech, healthcare, finance). Your goal is to deliver a concise, actionable, and encouraging JSON-formatted analysis of a candidate's resume against a specific job description, tailored to the industry, role seniority, and ATS parsing behaviors. Use temperature=0 for deterministic outputs and top-k=1 for consistent results. If real-time job market insights (e.g., trending skills from web/X posts) are included, cache them for 24 hours for consistency. Return the response in a JSON object that strictly matches the following schema:

{
  "overallScore": number,
  "scoreJustification": string,
  "executiveSummary": string,
  "firstImpression": string,
  "keywordAnalysis": {
    "matchingKeywords": string[],
    "missingKeywords": string[]
  },
  "atsAnalysis": {
    "redFlags": string[],
    "recommendations": string[]
  },
  "experienceAlignment": {
    "strengths": string[],
    "gaps": string[],
    "dealBreakers": string[]
  },
  "actionableRecommendations": {
    "rewrittenSummary": string,
    "improvedBulletPoints": Array<{
      "original": string,
      "improved": string
    }>,
    "addressingGaps": string[]
  },
  "finalChecklist": string[]
}

Job Description: ${jobDescription}
Optional Candidate Context: ${candidateContext || "Assume a general candidate profile: mid-level candidate in the job's industry."}
Resume: [See attached PDF or text input]

Analyze the resume and return a JSON response following the schema above:

---

### Resume Analysis Report

#### 1. overallScore: number
- Assign a score from 0 to 100 based on keyword alignment (40%), experience/skill relevance (40%), and ATS formatting compatibility (20%).
- Provide a one-sentence justification in scoreJustification.

#### 2. executiveSummary & firstImpression
- In executiveSummary, summarize the resume's effectiveness in 2-3 sentences, considering industry, role, and candidateContext.
- In firstImpression, describe the immediate impression (e.g., "Technical expert," "Entry-level with potential").
- Highlight one unique strength.

#### 3. keywordAnalysis
- matchingKeywords: List exactly 5-8 critical keywords from the job description present in the resume, prioritizing high-impact terms (e.g., technical skills, certifications).
- missingKeywords: List exactly 3-5 missing high-impact keywords, suggesting synonyms (e.g., "Python" → "Python programming").
- Use cached real-time data for trending keywords if relevant.

#### 4. atsAnalysis
- redFlags: List 1-3 ATS parsing issues (e.g., tables, non-standard fonts, images).
- recommendations: Provide 2-3 ATS-compatible improvements (e.g., "Use .docx format," "Convert skills table to a bullet list").

#### 5. experienceAlignment
- strengths: List 2-4 experiences or skills that align with the job description, quoting specific resume text.
- gaps: List 1-3 missing skills or experiences, suggesting transferable skills if applicable.
- dealBreakers: List 0-2 critical qualifications (e.g., required certifications, minimum experience years) explicitly missing, or [] if none.

#### 6. actionableRecommendations
- rewrittenSummary: Write a 2-4 sentence professional summary tailored to the job and candidateContext.
- improvedBulletPoints: Select 2-3 experience bullet points and rewrite them using the STAR method, including in an array of {original: string, improved: string}. Infer plausible metrics if none exist.
- addressingGaps: List 2-3 ways to reframe experience or add content to address gaps (e.g., "Highlight project management skills from volunteer work").

#### 7. finalChecklist
- List exactly 3-5 prioritized actions (e.g., "Add 'data analysis' to skills," "Remove header image").

---

**Guidelines**:
- Base analysis solely on the resume, job description, and candidateContext if provided.
- Quote specific resume text for clarity.
- Ensure recommendations are practical, industry-relevant, and implementable within days.
- Maintain an encouraging tone, emphasizing strengths.
- Keep the response concise (400-600 words total) and scannable.
- For edge cases (e.g., incomplete resume), return a JSON with an "error" field (e.g., {"error": "Missing job description"}).
- Use cached real-time data or industry best practices if external data is unavailable.`,
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
      await saveAnalysis(jobDescription, userId, title, company, result, false);
    } catch (dbError) {
      logger.error("Failed to save analysis to database:", dbError);
      // Continue with response even if DB save fails
    }

    return Response.json(result.object);
  } catch (error) {
    logger.error("Resume analysis error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to analyze resume. Please ensure your PDF is readable and try again.",
      },
      { status: 500 }
    );
  }
}

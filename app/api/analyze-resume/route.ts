import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/db";
import { analysis, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";

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
              text: `You are a world-class career coach and expert resume analyst with deep expertise in Applicant Tracking Systems (ATS) like Taleo, Workday, and iCIMS, as well as talent acquisition across industries such as tech, healthcare, finance, and more. Your goal is to deliver a concise, actionable, and encouraging analysis of a candidate's resume against a specific job description, optimizing for ATS compatibility and interview success. Tailor your advice to the industry, role seniority, and common ATS parsing behaviors. Use real-time job market insights (e.g., trending skills, certifications) from web or X post analysis when relevant to enhance recommendations.

Job Description: ${jobDescription}
Optional Candidate Context: ${candidateContext || 'Assume a general candidate profile if not provided.'}

Analyze the provided resume against the job description and provide a clear, scannable report as follows:

---

### Resume Analysis Report

#### 1. ATS Match Score: [Score]/100
- Assign a score from 0 to 100 based on keyword alignment (40%), experience/skill relevance (40%), and ATS formatting compatibility (20%).
- Justify the score in one sentence, referencing key strengths or gaps.

#### 2. Executive Summary & First Impression
- Summarize the candidate's suitability for the role in 2-3 sentences, considering industry and seniority.
- Describe the resume's immediate impression (e.g., "Technical expert," "Emerging leader," "Entry-level with potential").
- Highlight one unique strength that stands out.

#### 3. ATS & Keyword Optimization
**Keyword Analysis**:
- List 8-12 critical keywords from the job description present in the resume, prioritizing high-impact terms (e.g., technical skills, certifications).
- List 5-8 missing high-impact keywords, suggesting synonyms or related terms to include (e.g., if "Python" is missing, suggest "Python programming" or "scripting").
- If relevant, incorporate trending skills or keywords for the role based on real-time job market data from web or X post analysis.

**Formatting & Parsability**:
- Identify ATS red flags (e.g., tables, non-standard fonts, images, special characters like &).
- Provide 2-3 specific recommendations to improve ATS compatibility (e.g., "Use .docx format," "Convert skills table to a bullet list," "Avoid headers/footers").

#### 4. Experience & Skills Alignment
**Strengths**:
- List 3-5 resume experiences or skills that strongly align with the job description, quoting specific bullet points and explaining their relevance.
- Highlight transferable skills if direct experience is limited.

**Gaps & Improvements**:
- Identify 1-3 key gaps in experience or skills, avoiding overly negative framing.
- Suggest ways to reframe existing experience or highlight transferable skills to address gaps.
- If critical qualifications are missing, recommend accessible ways to gain them (e.g., certifications, projects).

#### 5. Actionable Recommendations
**Tailored Professional Summary**:
- Write a 2-4 sentence professional summary tailored to the job description, emphasizing relevant skills and achievements.

**Impact-Oriented Bullet Points**:
- Select 2-3 experience bullet points and rewrite them using the STAR method (Situation, Task, Action, Result).
- Incorporate quantifiable metrics where possible; if none exist, infer plausible metrics based on industry norms or rephrase qualitatively to show impact.

**Strategic Adjustments**:
- Suggest 1-2 ways to reorder sections or rephrase content to better align with the job description and de-emphasize gaps.

#### 6. Final Action Checklist
- Provide a concise list of 3-5 critical, prioritized actions the candidate should take before submitting the resume (e.g., "Add 'project management' to skills," "Simplify formatting," "Complete a relevant certification").

---

**Guidelines**:
- Base your analysis solely on the resume and job description content, using candidate context if provided.
- Quote specific resume text for clarity and specificity.
- Ensure recommendations are practical, industry-relevant, and implementable within days.
- Maintain an encouraging tone, emphasizing strengths while constructively addressing gaps.
- Keep the report concise (500-700 words max) and scannable with clear headings and bullet points.
- If real-time data is unavailable, rely on general best practices for the industry or role.`,
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
      await db.transaction(async (tx) => {
        await tx.insert(analysis).values({
          forResume: true,
          title: title || "Unnamed Analysis",
          company: company || "Unknown Company",
          analysisJson: result.object,
          jobDescription,
          userId,
          overallScore: result.object.overallScore,
          totalInsights: Object.keys(result.object.actionableRecommendations!)
            .length,
        });

        await tx
          .update(users)
          .set({
            creditsRemaining: sql`${users.creditsRemaining} - 1`,
          })
          .where(eq(users.id, userId));
      });
    } catch (dbError) {
      console.error("Failed to save analysis to database:", dbError);
      // Continue with response even if DB save fails
    }

    return Response.json(result.object);
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to analyze resume. Please ensure your PDF is readable and try again.",
      },
      { status: 500 }
    );
  }
}

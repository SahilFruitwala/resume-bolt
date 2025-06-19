import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/db";
import { analysis } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export const maxDuration = 60;

const coverLetterAnalysisSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall cover letter score out of 100"),
  scoreJustification: z
    .string()
    .describe("Brief justification for the score in one sentence"),
  executiveSummary: z
    .string()
    .describe("2-3 sentence summary of cover letter's effectiveness"),
  firstImpression: z
    .string()
    .describe("Immediate impression the cover letter gives"),
  structureAnalysis: z.object({
    strengths: z
      .array(z.string())
      .describe("Strong structural elements of the cover letter"),
    weaknesses: z
      .array(z.string())
      .describe("Structural issues that need improvement"),
    recommendations: z
      .array(z.string())
      .describe("Specific structural improvements"),
  }),
  contentAnalysis: z.object({
    relevanceToJob: z
      .array(z.string())
      .describe("How well content aligns with job requirements"),
    personalityAndFit: z
      .array(z.string())
      .describe("Assessment of personality and cultural fit demonstration"),
    valueProposition: z
      .array(z.string())
      .describe("How well the candidate's value is communicated"),
    gaps: z
      .array(z.string())
      .describe("Missing elements that should be addressed"),
  }),
  keywordAnalysis: z.object({
    matchingKeywords: z
      .array(z.string())
      .describe("Job-relevant keywords present in cover letter"),
    missingKeywords: z
      .array(z.string())
      .describe("Important keywords missing from cover letter"),
  }),
  toneAndStyle: z.object({
    assessment: z.string().describe("Assessment of tone and writing style"),
    improvements: z
      .array(z.string())
      .describe("Tone and style improvement suggestions"),
  }),
  actionableRecommendations: z.object({
    rewrittenOpening: z.string().describe("Improved opening paragraph"),
    rewrittenClosing: z.string().describe("Improved closing paragraph"),
    contentSuggestions: z
      .array(z.string())
      .describe("Specific content improvements"),
    callToActionImprovement: z
      .string()
      .describe("Better call-to-action suggestion"),
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
    const coverLetterText = formData.get("coverLetter") as string;
    const coverLetterFile = formData.get("coverLetterFile") as File;
    const jobDescription = formData.get("jobDescription") as string;
    const company = formData.get("company") as string;
    const title = formData.get("title") as string;

    if (!jobDescription) {
      return Response.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    if (!coverLetterText && !coverLetterFile) {
      return Response.json(
        { error: "Cover letter text or file is required" },
        { status: 400 }
      );
    }

    const coverLetterContent = coverLetterText;

    // If PDF file is provided, we'll analyze it directly
    if (coverLetterFile) {
      if (coverLetterFile.type !== "application/pdf") {
        return Response.json(
          { error: "Only PDF files are supported" },
          { status: 400 }
        );
      }
    }

    // Validate text input if provided
    if (coverLetterText && coverLetterText.trim().length < 100) {
      return Response.json(
        {
          error:
            "Cover letter text is too short. Please provide a complete cover letter.",
        },
        { status: 400 }
      );
    }

    const messages: any[] = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a world-class career coach and expert cover letter analyst, specializing in helping candidates create compelling cover letters that land interviews across all industries. Your goal is to provide detailed, constructive, and highly actionable analysis of a candidate's cover letter against a specific job description. Your tone should be encouraging and empowering.

Job Description: ${jobDescription}

${
  coverLetterText
    ? `Cover Letter Text: ${coverLetterText}`
    : "Cover Letter: [See attached PDF]"
}

Please conduct a thorough analysis of the provided cover letter against the job description. Provide the following comprehensive breakdown:

Cover Letter Analysis Report

1. Overall Match Score: [Score]/100
- Provide a score from 0 to 100 that represents the cover letter's effectiveness for this specific job.
- Briefly justify the score in one sentence.

2. Executive Summary & First Impression
- Provide a 2-3 sentence summary of the cover letter's overall effectiveness.
- What is the immediate impression this cover letter gives? (e.g., "Professional and confident," "Generic and unfocused," "Passionate but needs refinement").

3. Structure & Format Analysis
Strengths:
- Identify strong structural elements (opening hook, logical flow, professional formatting, appropriate length, etc.)

Weaknesses:
- Identify structural issues (weak opening, poor transitions, formatting problems, length issues, etc.)

Recommendations:
- Provide specific advice to improve structure and format.

4. Content Analysis
Relevance to Job:
- How well does the content align with the job requirements and company needs?
- Are the most important qualifications and experiences highlighted?

Personality & Cultural Fit:
- Does the cover letter demonstrate personality and cultural fit?
- Is the candidate's enthusiasm and motivation clear?

Value Proposition:
- How effectively does the candidate communicate their unique value?
- Are achievements and impact clearly articulated?

Content Gaps:
- What important elements are missing that should be addressed?

5. Keyword Analysis
Matching Keywords:
- List the most important keywords from the job description that ARE present in the cover letter.

Missing Keywords:
- List critical keywords from the job description that are NOT present in the cover letter.

6. Tone & Writing Style
Assessment:
- Evaluate the overall tone, professionalism, and writing quality.

Improvements:
- Suggest specific improvements to tone, style, and language use.

7. Actionable Recommendations for Improvement
Rewritten Opening Paragraph:
- Provide a new, compelling opening paragraph tailored to this specific job.

Rewritten Closing Paragraph:
- Provide an improved closing with a strong call-to-action.

Content Suggestions:
- Specific recommendations for improving the body paragraphs.

Call-to-Action Improvement:
- Suggest a more effective way to request an interview or next steps.

8. Final Checklist for the Candidate
- Provide 3-5 of the most critical actions the candidate should take before submitting this cover letter.

IMPORTANT: Base your analysis entirely on the actual content of the provided cover letter and job description. Be specific, quote actual text from the cover letter when relevant, and provide actionable advice that the candidate can implement immediately.`,
          },
        ],
      },
    ];

    // Add PDF file if provided
    if (coverLetterFile) {
      const coverLetterBuffer = await coverLetterFile.arrayBuffer();
      messages[0].content.push({
        type: "file",
        data: coverLetterBuffer,
        mimeType: "application/pdf",
      });
    }

    const result = await generateObject({
      model: google("gemini-2.0-flash"),
      messages,
      schema: coverLetterAnalysisSchema,
      temperature: 0.1,
    });

    try {
      await db.insert(analysis).values({
        forResume: false,
        title: title || "Unnamed Analysis",
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
    console.error("Cover letter analysis error:", error);
    return Response.json(
      {
        error: "Failed to analyze cover letter. Please try again.",
      },
      { status: 500 }
    );
  }
}

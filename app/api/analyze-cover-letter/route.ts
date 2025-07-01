import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/db";
import { analysis } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { saveAnalysis } from "@/db/queries/insert";
import logger from "@/lib/logger";

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
  logger.info("Cover letter analysis request received");
  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized request for cover letter analysis");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const coverLetterText = formData.get("coverLetter") as string;
    const coverLetterFile = formData.get("coverLetterFile") as File;
    const jobDescription = formData.get("jobDescription") as string;
    const company = formData.get("company") as string;
    const title = formData.get("title") as string;

    if (!jobDescription) {
      logger.warn("Job description is required for cover letter analysis");
      return Response.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    if (!coverLetterText && !coverLetterFile) {
      logger.warn("Cover letter text or file is required");
      return Response.json(
        { error: "Cover letter text or file is required" },
        { status: 400 }
      );
    }

    const coverLetterContent = coverLetterText;

    // If PDF file is provided, we'll analyze it directly
    if (coverLetterFile && !coverLetterText) {
      if (coverLetterFile.type !== "application/pdf") {
        logger.warn("Invalid file type for cover letter analysis");
        return Response.json(
          { error: "Only PDF files are supported" },
          { status: 400 }
        );
      }
    }

    // Validate text input if provided
    if (coverLetterText && coverLetterText.trim().length < 100) {
      logger.warn("Cover letter text is too short");
      return Response.json(
        {
          error:
            "Cover letter text is too short. Please provide a complete cover letter.",
        },
        { status: 400 }
      );
    }
    const candidateContext = ''

    const messages: any[] = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a world-class career coach and expert cover letter analyst with deep expertise in crafting compelling cover letters that align with Applicant Tracking Systems (ATS) like Taleo, Workday, and iCIMS, and secure interviews across industries (e.g., tech, healthcare, finance). Your goal is to deliver a concise, actionable, and encouraging JSON-formatted analysis of a candidate's cover letter against a specific job description, tailored to the industry, role seniority, and company culture. Use temperature=0 for deterministic outputs and top-k=1 for consistent results. If real-time job market insights (e.g., trending skills from web/X posts) are included, cache them for 24 hours for consistency. Return the response in a JSON object that strictly matches the following schema:

{
  "overallScore": number,
  "scoreJustification": string,
  "executiveSummary": string,
  "firstImpression": string,
  "structureAnalysis": {
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": string[]
  },
  "contentAnalysis": {
    "relevanceToJob": string[],
    "personalityAndFit": string[],
    "valueProposition": string[],
    "gaps": string[]
  },
  "keywordAnalysis": {
    "matchingKeywords": string[],
    "missingKeywords": string[]
  },
  "toneAndStyle": {
    "assessment": string,
    "improvements": string[]
  },
  "actionableRecommendations": {
    "rewrittenOpening": string,
    "rewrittenClosing": string,
    "contentSuggestions": string[],
    "callToActionImprovement": string
  },
  "finalChecklist": string[]
}

Job Description: ${jobDescription}
Optional Candidate Context: ${candidateContext || "Assume a general candidate profile: mid-level candidate in the job's industry."}
${coverLetterText
                ? `Cover Letter Text: ${coverLetterText}`
                : "Cover Letter: [See attached PDF]"
              }

Analyze the cover letter and return a JSON response following the schema above:

---

### Cover Letter Analysis Report

#### 1. overallScore: number
- Assign a score from 0 to 100 based on content relevance (40%), keyword alignment (30%), tone/cultural fit (20%), and structure/formatting (10%).
- Provide a one-sentence justification in scoreJustification.

#### 2. executiveSummary & firstImpression
- In executiveSummary, summarize the cover letter's effectiveness in 2-3 sentences, considering industry, role, and company culture.
- In firstImpression, describe the immediate impression (e.g., "Confident and role-specific," "Generic and unfocused").
- Highlight one unique strength.

#### 3. structureAnalysis
- strengths: List 2-4 strong structural elements (e.g., engaging opening, clear flow, 250-400 word length).
- weaknesses: List 1-3 issues (e.g., weak hook, ATS risks like complex formatting).
- recommendations: Provide 2-3 ATS-compatible improvements (e.g., "Use .docx format," "Simplify to single-column layout").

#### 4. contentAnalysis
- relevanceToJob: List 2-4 points on how well the content aligns with the job's requirements, quoting specific text.
- personalityAndFit: List 2-3 points on enthusiasm and cultural fit, referencing company culture (use X post data if available).
- valueProposition: List 2-3 points on how effectively the candidate communicates unique value, suggesting metrics if absent.
- gaps: List 1-3 missing elements (e.g., key skills) and suggest transferable skills or additions.

#### 5. keywordAnalysis
- matchingKeywords: List exactly 5-8 critical keywords from the job description present in the cover letter, prioritizing high-impact terms.
- missingKeywords: List exactly 3-5 missing high-impact keywords, suggesting synonyms (e.g., "Agile" → "Scrum").
- Use cached real-time data for trending keywords if relevant.

#### 6. toneAndStyle
- assessment: Evaluate tone (e.g., formal, conversational) and its alignment with industry/company culture in 1-2 sentences.
- improvements: List 1-3 specific changes (e.g., "Adopt a dynamic tone for startups").

#### 7. actionableRecommendations
- rewrittenOpening: Write a 3-4 sentence opening tailored to the job and company culture.
- rewrittenClosing: Write a 2-3 sentence closing with a confident call-to-action.
- contentSuggestions: List 2-3 improvements for body paragraphs (e.g., "Add a STAR-based achievement").
- callToActionImprovement: Suggest a specific, role-relevant call-to-action.

#### 8. finalChecklist
- List exactly 3-5 prioritized actions (e.g., "Add 'data analysis' keyword," "Shorten to 300 words").

---

**Guidelines**:
- Base analysis solely on the cover letter and job description, using candidateContext for personalization.
- Quote specific text for clarity.
- Ensure recommendations are practical, industry-relevant, and implementable within days.
- Maintain an encouraging tone, emphasizing strengths.
- Keep the response concise (400-600 words total) and scannable.
- For edge cases (e.g., incomplete input), return a JSON with an "error" field (e.g., {"error": "Missing job description"}).
- Use cached real-time data or industry best practices if external data is unavailable.`,
          },
        ],
      },
    ];

    // Add PDF file if provided
    if (coverLetterFile && !coverLetterText) {
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
      await saveAnalysis(jobDescription, userId, title, company, result, false);
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

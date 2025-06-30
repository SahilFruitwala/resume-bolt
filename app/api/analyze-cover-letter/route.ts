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
    const candidateContext = ''

    const messages: any[] = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a world-class career coach and expert cover letter analyst with deep expertise in crafting compelling cover letters that align with Applicant Tracking Systems (ATS) like Taleo, Workday, and iCIMS, and secure interviews across industries (e.g., tech, healthcare, finance). Your goal is to deliver a concise, actionable, and encouraging analysis of a candidate's cover letter against a specific job description, tailored to the industry, role seniority, and company culture. Use real-time job market insights (e.g., trending skills, certifications, or cultural fit indicators) from web or X post analysis when relevant to enhance recommendations. Your tone should be empowering and motivating.

Job Description: ${jobDescription}
Optional Candidate Context: ${candidateContext || 'Assume a general candidate profile if not provided.'}
${
  coverLetterText
    ? `Cover Letter Text: ${coverLetterText}`
    : "Cover Letter: [See attached PDF]"
}

Analyze the provided cover letter against the job description and provide a clear, scannable report as follows:

---

### Cover Letter Analysis Report

#### 1. Overall Match Score: [Score]/100
- Assign a score from 0 to 100 based on content relevance (40%), keyword alignment (30%), tone/cultural fit (20%), and structure/formatting (10%).
- Justify the score in one sentence, referencing key strengths or gaps.

#### 2. Executive Summary & First Impression
- Summarize the cover letter’s effectiveness in 2-3 sentences, considering industry, role, and company culture.
- Describe the immediate impression (e.g., "Confident and role-specific," "Generic and unfocused," "Passionate but overly formal").
- Highlight one unique strength that stands out.

#### 3. Structure & ATS Compatibility
**Strengths**:
- Identify strong structural elements (e.g., engaging opening, clear flow, professional formatting, 250-400 word length).

**Weaknesses**:
- Note issues like weak hooks, poor transitions, or ATS parsing risks (e.g., complex formatting, headers/footers, special characters).

**Recommendations**:
- Provide 2-3 specific improvements (e.g., "Simplify to a single-column .docx format," "Shorten to 300 words," "Strengthen opening with a role-specific hook").

#### 4. Content & Alignment
**Job Relevance**:
- Evaluate how well the cover letter addresses the job's requirements and company needs, quoting specific text to show alignment or gaps.
- Highlight whether key qualifications or experiences are emphasized.

**Personality & Cultural Fit**:
- Assess if the cover letter conveys enthusiasm, motivation, and alignment with the company's culture or values (e.g., innovation for tech, empathy for healthcare).
- Use real-time data (e.g., X posts about company culture) if available.

**Value Proposition**:
- Analyze how effectively the candidate communicates their unique value, citing specific achievements or impact.
- If metrics are absent, suggest ways to infer or rephrase qualitative impact.

**Gaps**:
- Identify 1-3 missing elements (e.g., key skills, company-specific motivations) and suggest ways to address them via transferable skills or additional content.

#### 5. Keyword Analysis
- List 5-8 critical keywords from the job description present in the cover letter, prioritizing high-impact terms (e.g., technical skills, certifications).
- List 3-5 missing high-impact keywords, suggesting synonyms or related terms (e.g., if "Agile" is missing, suggest "Agile methodology" or "Scrum").
- If relevant, include trending skills or keywords for the role based on real-time job market data from web or X post analysis.

#### 6. Tone & Writing Style
**Assessment**:
- Evaluate tone (e.g., formal, conversational, creative) and its alignment with industry norms or company culture (e.g., formal for finance, dynamic for startups).
- Assess professionalism, clarity, and writing quality (e.g., grammar, conciseness).

**Improvements**:
- Suggest 1-2 specific changes (e.g., "Adopt a more conversational tone for startup roles," "Eliminate jargon for clarity").

#### 7. Actionable Recommendations
**Rewritten Opening Paragraph**:
- Write a compelling, role-specific opening (3-4 sentences) tailored to the job and company culture.

**Rewritten Closing Paragraph**:
- Write a strong closing (2-3 sentences) with a clear, confident call-to-action for an interview.

**Content Enhancements**:
- Suggest 2-3 specific improvements for body paragraphs (e.g., "Add a STAR-based achievement," "Mention company values like innovation").

#### 8. Final Action Checklist
- Provide a concise list of 3-5 prioritized actions the candidate should take before submitting (e.g., "Incorporate 'data analysis' keyword," "Align tone with company's collaborative culture," "Shorten to 300 words").

---

**Guidelines**:
- Base your analysis solely on the cover letter and job description, using candidate context if provided.
- Quote specific cover letter text for clarity and specificity.
- Ensure recommendations are practical, industry-relevant, and implementable within days.
- Maintain an encouraging tone, emphasizing strengths while constructively addressing gaps.
- Keep the report concise (400-600 words) and scannable with clear headings and bullet points.
- If real-time data is unavailable, rely on general best practices for the industry or role.`,
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

import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { auth } from "@clerk/nextjs/server";

export const maxDuration = 60;

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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

${coverLetterText ? `Cover Letter Text: ${coverLetterText}` : "Cover Letter: [See attached PDF]"}

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

    // const obj = {
    //   overallScore: 55,
    //   scoreJustification:
    //     "The cover letter demonstrates some relevant technical skills but fails to adequately address the core requirements of the job description, particularly C# development and experience in a financial services environment.",
    //   executiveSummary:
    //     "The cover letter is geared towards a full-stack role and doesn't adequately highlight the C# development skills and experience required for this specific position. It needs to be refocused to emphasize relevant skills and experience and address the key requirements of the job description. The immediate impression is that the candidate is a skilled full-stack developer, but not necessarily the right fit for this particular role.",
    //   firstImpression:
    //     "The cover letter gives the impression of a skilled full-stack developer with experience in Django and React, but it needs to be more tailored to the specific requirements of a C# development role in a financial services environment.",
    //   structureAnalysis: {
    //     strengths: [
    //       "The cover letter has a clear and professional format.",
    //       "The letter includes a brief summary of the candidate's experience and skills.",
    //       "The closing paragraph expresses gratitude and a desire for further discussion.",
    //     ],
    //     weaknesses: [
    //       "The opening paragraph is generic and doesn't immediately grab the reader's attention.",
    //       "The letter lacks a strong narrative or compelling story that showcases the candidate's passion and abilities.",
    //       "The work authorization paragraph is placed in the middle of the letter, disrupting the flow.",
    //     ],
    //     recommendations: [
    //       "Move the work authorization paragraph to the end of the letter, as it is not the most compelling information to highlight.",
    //       "Use bullet points to list your key C# skills and achievements, making them easier to read and digest.",
    //       "Ensure that each paragraph has a clear focus and contributes to your overall value proposition.",
    //     ],
    //   },
    //   contentAnalysis: {
    //     relevanceToJob: [
    //       "The cover letter is partially relevant, as it mentions technical skills. However, it emphasizes full-stack skills that are not the primary focus of the job description.",
    //       "The letter does not adequately address the core requirements of C# development, multi-threading, and collaboration with quants and traders.",
    //     ],
    //     personalityAndFit: [
    //       "The cover letter demonstrates some enthusiasm and a collaborative spirit, but it could be more tailored to the specific culture and needs of a financial services technology team.",
    //       "The phrase 'I am genuinely passionate about what you have provided with JIRA and Trello' is vague and doesn't clearly articulate your passion or how it relates to the job.",
    //     ],
    //     valueProposition: [
    //       "The candidate highlights achievements like 'achieving a 40% faster response time' and 'boosting reusability by 50%'. However, these achievements are related to Django and React, not C#.",
    //       "The value proposition is not clearly aligned with the specific needs of the role, which requires C# development and support for a financial platform.",
    //     ],
    //     gaps: [
    //       "The cover letter focuses heavily on full-stack development and technologies like React and Django, which are not the primary focus of the job description. The job description emphasizes C# development and multi-threading.",
    //       "The cover letter does not explicitly address the 'correct attitude' requirement, which is crucial for this role.",
    //       "The cover letter lacks specific examples of working directly with quants and traders or providing 3rd line support.",
    //     ],
    //   },
    //   keywordAnalysis: {
    //     matchingKeywords: [
    //       "C#",
    //       "JavaScript",
    //       "Python",
    //       "testing",
    //       "documentation",
    //       "release",
    //       "global",
    //       "technology",
    //       "Bachelor’s degree",
    //       "communication",
    //     ],
    //     missingKeywords: [
    //       "multi-threading",
    //       "WPF",
    //       "messaging",
    //       "React",
    //       "Angular",
    //       "financial services",
    //       "quants",
    //       "traders",
    //       "3rd line support",
    //       "commodities",
    //       "applications development",
    //     ],
    //   },
    //   toneAndStyle: {
    //     assessment:
    //       "The tone of the cover letter is professional and enthusiastic. However, the writing style could be more concise and impactful.",
    //     improvements: [
    //       "Use stronger action verbs to describe your accomplishments.",
    //       "Avoid vague phrases like 'I am genuinely passionate about' and replace them with specific examples of your passion.",
    //       "Proofread carefully for any errors in grammar or spelling.",
    //     ],
    //   },
    //   actionableRecommendations: {
    //     rewrittenOpening:
    //       "I am writing to express my strong interest in the Application Development position at [Company Name], as advertised on [Platform]. With my C# development experience, understanding of multi-threading, and passion for collaborative problem-solving, I am confident I can contribute to your team's success in developing and supporting critical platform components.",
    //     rewrittenClosing:
    //       "Thank you for your time and consideration. I am eager to discuss how my C# development experience and collaborative approach can contribute to your team's success. I am available for an interview at your earliest convenience.",
    //     contentSuggestions: [
    //       "Quantify your experience with C# development, highlighting specific projects and their impact.",
    //       "Mention your understanding of multi-threading in C#, as this is a key requirement.",
    //       "Even though React is listed as 'a plus but not required,' briefly mentioning your willingness to learn it could strengthen your application.",
    //       "Address the 'correct attitude' requirement by explicitly stating your commitment to treating business, quants, and tech colleagues as clients.",
    //     ],
    //     callToActionImprovement:
    //       "Instead of a generic 'I look forward to discussing this opportunity with you,' try: 'I am eager to discuss how my C# and collaborative skills can contribute to your team's success. I am available for an interview at your earliest convenience.'",
    //   },
    //   finalChecklist: [
    //     "Rewrite the opening paragraph to focus on your C# development experience and understanding of multi-threading.",
    //     "Provide specific examples of your C# projects and their impact, quantifying your achievements whenever possible.",
    //     "Address the 'correct attitude' requirement by explicitly stating your commitment to treating business, quants, and tech colleagues as clients.",
    //     "Remove or minimize the focus on full-stack technologies like React and Django, as they are not the primary focus of the job description.",
    //     "Proofread carefully for any errors in grammar or spelling.",
    //   ],
    // };

    const result = await generateObject({
      model: google("gemini-2.0-flash"),
      messages,
      schema: coverLetterAnalysisSchema,
      temperature: 0.1,
    });

    // Save analysis to Convex database
    try {
      await convex.mutation(api.analysis.create, {
        userId: userId,
        type: "cover-letter",
        title:
          title || `Cover Letter Analysis - ${new Date().toLocaleDateString()}`,
        company: company || "Unknown Company",
        jobDescription,
        fileName: coverLetterFile?.name,
        fileSize: coverLetterFile?.size,
        analysis: result.object,
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

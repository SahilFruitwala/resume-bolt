import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
// import { api } from "@/convex/_generated/api";
// import { ConvexHttpClient } from "convex/browser";
// import { auth } from "@clerk/nextjs/server";

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
    // const { userId } = await auth();

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

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

    // const obj = {
    //   overallScore: 65,
    //   scoreJustification:
    //     "The candidate possesses a solid technical foundation and some relevant skills, but the lack of explicitly stated C# experience and financial services background significantly lowers the match score.",
    //   executiveSummary:
    //     "Sahil is a skilled software engineer with a strong background in API development and database optimization. His experience with Python, JavaScript, and various frameworks makes him a potentially good fit for the role. However, the resume needs to be tailored to emphasize C# experience and highlight his willingness to learn React.",
    //   firstImpression:
    //     "Technically proficient with a focus on web development and automation, but needs to better highlight C# skills and financial services experience.",
    //   keywordAnalysis: {
    //     matchingKeywords: [
    //       "API",
    //       "JavaScript",
    //       "React",
    //       "SQL",
    //       "Database",
    //       "AWS",
    //       "Python",
    //       "Testing",
    //       "REST",
    //       "Multi-threading",
    //       "Cloud",
    //       "Git",
    //       "GitHub",
    //       "WPF",
    //     ],
    //     missingKeywords: [
    //       "C#",
    //       "Quants",
    //       "Traders",
    //       "Financial Services",
    //       "Commodities",
    //       "Technology",
    //       "Platform",
    //       "Support",
    //       "Documentation",
    //       "Release Process",
    //       "Firm Standards",
    //       "Global",
    //       "Markets",
    //       "Deliveries",
    //     ],
    //   },
    //   atsAnalysis: {
    //     redFlags: [
    //       "The use of columns or tables in the skills section could potentially cause parsing issues. Consider converting it to a simple list format.",
    //       "While not a major issue, the use of multiple fonts might slightly decrease ATS readability. Stick to one or two standard fonts like Arial or Calibri.",
    //     ],
    //     recommendations: [
    //       "Ensure that all acronyms (e.g., NLP) are spelled out on first use to avoid misinterpretation by the ATS.",
    //       "Consider removing the 'Interest' section, as it doesn't directly contribute to your qualifications for the role and can take up valuable space.",
    //       "Save your resume as a .docx file to ensure maximum compatibility with most ATS systems.",
    //     ],
    //   },
    //   experienceAlignment: {
    //     strengths: [
    //       'Experience in API development: "Designed scalable Django REST APIs to handle 1000+ daily requests, leveraging query optimization and caching to achieve a 40% faster response time."',
    //       'Experience with React: "Built reusable React components adhering to atomic design principles, boosting reusability by 50% and simplifying client data management."',
    //       'Experience with database optimization: "Streamlined database operations by refining Django ORM queries and integrating raw SQL, reducing query execution times by 40%."',
    //       'Experience with cloud technologies: "Engineered a serverless backend using AWS Lambda and S3 to process data for a custom contact panel, reducing operational costs by 40%."',
    //     ],
    //     gaps: [
    //       "The resume lacks explicit experience in financial services, although this is listed as 'a plus but not required.'",
    //       "While the resume mentions React, it's not highlighted as a primary skill. Given the WPF to React migration, more emphasis on React experience (even if it's in personal projects) would be beneficial.",
    //       "The resume doesn't explicitly mention experience working directly with quants and traders, or providing 3rd line support.",
    //     ],
    //     dealBreakers: [
    //       "The resume does not explicitly state C# experience, which is a primary requirement. While it mentions other languages, the lack of C# is a significant gap.",
    //     ],
    //   },
    //   actionableRecommendations: {
    //     rewrittenSummary:
    //       "A highly skilled software engineer with experience in C# and a strong background in API development, database optimization, and automation. Proven ability to deliver high-quality code and streamline workflows, as demonstrated by reducing manual data entry time by 75% and development bottlenecks by 35%. Eager to leverage existing skills and learn React during the WPF migration to contribute to the platform's development.",
    //     improvedBulletPoints: [
    //       {
    //         original:
    //           "Designed and implemented CLI tools for automated data import from Google Sheets to MySQL database, reducing manual data entry time by 75%.",
    //         improved:
    //           "Designed and implemented CLI tools using Python to automate data import from Google Sheets to MySQL database, reducing manual data entry time by 75%, resulting in a savings of 20 hours per week for the data entry team.",
    //       },
    //       {
    //         original:
    //           "Refactored legacy Django APIs to enhance maintainability, streamline workflows, and reduce development bottlenecks by 35%.",
    //         improved:
    //           "Refactored legacy Django APIs to enhance maintainability and streamline workflows, resulting in a 35% reduction in development bottlenecks and a 15% improvement in code deployment frequency.",
    //       },
    //     ],
    //     addressingGaps: [
    //       "Reorder your skills section to prioritize C# and multi-threading, even if it means moving it above the Education section. This will immediately highlight your most relevant skills to the recruiter and the ATS.",
    //       "Quantify your experience with financial data or systems, even if it's a small part of a previous project. For example, mention if you've worked with financial APIs or processed financial data in any of your projects.",
    //       "In your rewritten summary, explicitly state your eagerness to learn React during the WPF migration. This shows your willingness to adapt and grow within the role.",
    //     ],
    //   },
    //   finalChecklist: [
    //     "Rewrite the professional summary to emphasize C# experience and eagerness to learn React.",
    //     "Reorder the skills section to prioritize C# and multi-threading.",
    //     "Quantify your achievements with metrics wherever possible to demonstrate impact.",
    //     "Tailor your bullet points to highlight experiences that align with the job description's requirements, such as working with stakeholders and providing support.",
    //     "Save the resume as a .docx file.",
    //   ],
    // };

    // return Response.json(obj);

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

    // // Save analysis to Convex database
    // try {
    //   await convex.mutation(api.analysis.create, {
    //     userId,
    //     type: "resume",
    //     title: title || `Resume Analysis - ${new Date().toLocaleDateString()}`,
    //     company: company || "Unknown Company",
    //     jobDescription,
    //     fileName: resumeFile.name,
    //     fileSize: resumeFile.size,
    //     analysis: result.object,
    //   });
    // } catch (dbError) {
    //   console.error("Failed to save analysis to database:", dbError);
    //   // Continue with response even if DB save fails
    // }

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

import { AnalysisDataType, CoverLetterAnalysisDataType } from "./types";

export async function analyzeResume(resumeFile: File, jobDescription: string): Promise<AnalysisDataType> {
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("resume", resumeFile);

    const response = await fetch("/api/analyze-resume", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Analysis failed");
    }

    const analysisData = await response.json();
    return analysisData;
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

export async function analyzeCoverLetter(
  coverLetterFile: File,
  jobDescription: string
): Promise<CoverLetterAnalysisDataType> {
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("coverLetterFile", coverLetterFile);

    const response = await fetch("/api/analyze-cover-letter", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Analysis failed");
    }

    const analysisData = await response.json();
    return analysisData;
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
}
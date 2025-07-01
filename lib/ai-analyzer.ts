import { AnalysisDataType, CoverLetterAnalysisDataType } from "./types";

export async function analyzeResume(
  resumeFile: File,
  jobDescription: string,
  analysisName: string
): Promise<AnalysisDataType> {
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("resume", resumeFile);
    formData.append("tile", analysisName);

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
    console.error("Analysis error:", error);
    throw error;
  }
}

export async function analyzeCoverLetter(
  coverLetterFile: File,
  coverLetterInput: string,
  jobDescription: string,
  analysisName: string
): Promise<CoverLetterAnalysisDataType> {
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("coverLetterFile", coverLetterFile);
    formData.append("title", analysisName);
    formData.append("coverLetter", coverLetterInput);

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
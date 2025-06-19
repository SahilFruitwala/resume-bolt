interface AnalysisData {
  overallScore: number;
  skillsMatch: number;
  atsScore: number;
  formatScore: number;
  keyStrengths: string[];
  missingKeywords: string[];
  improvements: string[];
  atsRecommendations: string[];
  formatFeedback: string[];
}

export async function analyzeResume(resumeFile: File, jobDescription: string): Promise<AnalysisData> {
  try {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const analysisData = await response.json();
    return analysisData;
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}
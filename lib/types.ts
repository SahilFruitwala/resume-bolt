export interface AnalysisDataType {
  overallScore: number;
  scoreJustification: string;
  executiveSummary: string;
  firstImpression: string;
  keywordAnalysis: {
    matchingKeywords: string[];
    missingKeywords: string[];
  };
  atsAnalysis: {
    redFlags: string[];
    recommendations: string[];
  };
  experienceAlignment: {
    strengths: string[];
    gaps: string[];
    dealBreakers: string[];
  };
  actionableRecommendations: {
    rewrittenSummary: string;
    improvedBulletPoints: Array<{
      original: string;
      improved: string;
    }>;
    addressingGaps: string[];
  };
  finalChecklist: string[];
}

export interface CoverLetterAnalysisDataType {
  overallScore: number;
  scoreJustification: string;
  executiveSummary: string;
  firstImpression: string;
  structureAnalysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  contentAnalysis: {
    relevanceToJob: string[];
    personalityAndFit: string[];
    valueProposition: string[];
    gaps: string[];
  };
  keywordAnalysis: {
    matchingKeywords: string[];
    missingKeywords: string[];
  };
  toneAndStyle: {
    assessment: string;
    improvements: string[];
  };
  actionableRecommendations: {
    rewrittenOpening: string;
    rewrittenClosing: string;
    contentSuggestions: string[];
    callToActionImprovement: string;
  };
  finalChecklist: string[];
}

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
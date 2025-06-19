'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  FileCheck, 
  Layout, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Star,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisData {
    overallScore: number
    scoreJustification: string
    executiveSummary: string
    firstImpression: string
    keywordAnalysis: {
      matchingKeywords: string[]
      missingKeywords: string[]
    }
    atsAnalysis: {
      redFlags: string[]
      recommendations: string[]
    }
    experienceAlignment: {
      strengths: string[]
      gaps: string[]
      dealBreakers: string[]
    }
    actionableRecommendations: {
      rewrittenSummary: string
      improvedBulletPoints: Array<{
        original: string
        improved: string
      }>
      addressingGaps: string[]
    }
    finalChecklist: string[]
  }

interface AnalysisResultsProps {
  data: AnalysisData;
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const downloadReport = () => {
    const reportContent = `
AI Resume Analysis Report
========================

Overall Score: ${data.overallScore}%
Skills Match: ${data.skillsMatch}%
ATS Compatibility: ${data.atsScore}%
Format Quality: ${data.formatScore}%

Key Strengths:
${data.keyStrengths.map(strength => `• ${strength}`).join('\n')}

Missing Keywords:
${data.missingKeywords.map(keyword => `• ${keyword}`).join('\n')}

Improvement Recommendations:
${data.improvements.map(improvement => `• ${improvement}`).join('\n')}

ATS Recommendations:
${data.atsRecommendations.map(rec => `• ${rec}`).join('\n')}

Format Feedback:
${data.formatFeedback.map(feedback => `• ${feedback}`).join('\n')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-analysis-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className={`text-6xl font-bold ${getScoreColor(data.overallScore)}`}>
                {data.overallScore}%
              </div>
              <Star className="h-8 w-8 text-yellow-500 ml-2" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Overall Resume Score</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your resume has been analyzed against the job requirements. 
              Here's how well it matches and where you can improve.
            </p>
            <Button onClick={downloadReport} className="mt-4" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Full Report
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
            Score Breakdown
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">Skills Match</span>
                </div>
                <Badge variant={getScoreBadgeVariant(data.skillsMatch)}>
                  {data.skillsMatch}%
                </Badge>
              </div>
              <Progress value={data.skillsMatch} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileCheck className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">ATS Compatible</span>
                </div>
                <Badge variant={getScoreBadgeVariant(data.atsScore)}>
                  {data.atsScore}%
                </Badge>
              </div>
              <Progress value={data.atsScore} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Layout className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-medium">Format Quality</span>
                </div>
                <Badge variant={getScoreBadgeVariant(data.formatScore)}>
                  {data.formatScore}%
                </Badge>
              </div>
              <Progress value={data.formatScore} className="h-2" />
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-green-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              Key Strengths
            </h3>
            <div className="space-y-3">
              {data.keyStrengths.map((strength, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Missing Keywords */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-red-700">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Missing Keywords
            </h3>
            <div className="space-y-2">
              {data.missingKeywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="mr-2 mb-2">
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Consider incorporating these keywords naturally into your resume content.
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-blue-600" />
            Improvement Recommendations
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">General Improvements</h4>
              <div className="space-y-2">
                {data.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                    </div>
                    <span className="text-sm">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">ATS Optimization</h4>
              <div className="space-y-2">
                {data.atsRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start">
                    <FileCheck className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Format & Structure</h4>
              <div className="space-y-2">
                {data.formatFeedback.map((feedback, index) => (
                  <div key={index} className="flex items-start">
                    <Layout className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feedback}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
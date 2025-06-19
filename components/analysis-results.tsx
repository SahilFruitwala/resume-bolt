"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ArrowLeft,
  Star,
  Target,
  Lightbulb,
  Eye,
  Search,
  Users,
  CheckSquare,
  Edit3,
} from "lucide-react";
import { AnalysisDataType } from "@/lib/types";

interface ResumeAnalysisProps {
  analysis: AnalysisDataType;
}

export function ResumeAnalysis({ analysis }: ResumeAnalysisProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 bg-background text-foreground">
      {/* <div className="flex items-center justify-between">
          <Button onClick={onReset} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Analyze Another Resume
          </Button>
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${getScoreBgColor(analysis.overallScore)}`}>
            <Star className={`h-6 w-6 ${getScoreColor(analysis.overallScore)}`} />
            <span className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}/100
            </span>
          </div>
        </div> */}

      {/* Rest of the existing content remains the same */}
      {/* Score Justification */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {analysis.scoreJustification}
          </p>
        </CardContent>
      </Card>

      {/* Executive Summary & First Impression */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Eye className="h-5 w-5 text-blue-600" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {analysis.executiveSummary}
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Users className="h-5 w-5 text-purple-600" />
              First Impression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {analysis.firstImpression}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All other existing sections remain exactly the same */}
      {/* Keyword Analysis */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <Search className="h-5 w-5 text-green-600" />
            Keyword Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-green-600 mb-2">
              Matching Keywords (
              {analysis.keywordAnalysis.matchingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keywordAnalysis.matchingKeywords.length > 0 ? (
                analysis.keywordAnalysis.matchingKeywords.map(
                  (keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    >
                      {keyword}
                    </Badge>
                  )
                )
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No keyword matches found
                </span>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-red-600 mb-2">
              Missing Keywords (
              {analysis.keywordAnalysis.missingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keywordAnalysis.missingKeywords.length > 0 ? (
                analysis.keywordAnalysis.missingKeywords.map(
                  (keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    >
                      {keyword}
                    </Badge>
                  )
                )
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  All important keywords are present
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ATS Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              ATS Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.atsAnalysis.redFlags.length > 0 ? (
              <ul className="space-y-3">
                {analysis.atsAnalysis.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {flag}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">No major ATS issues detected</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Target className="h-5 w-5" />
              ATS Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.atsAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {rec}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Experience Alignment */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.experienceAlignment.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Experience Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.experienceAlignment.gaps.map((gap, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {gap}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Critical Missing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.experienceAlignment.dealBreakers.length > 0 ? (
              <ul className="space-y-3">
                {analysis.experienceAlignment.dealBreakers.map(
                  (dealBreaker, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {dealBreaker}
                      </span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  No critical qualifications missing
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actionable Recommendations */}
      <div className="space-y-6">
        {/* Rewritten Summary */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Edit3 className="h-5 w-5 text-blue-600" />
              Rewritten Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{analysis.actionableRecommendations.rewrittenSummary}"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Improved Bullet Points */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Improved Bullet Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.actionableRecommendations.improvedBulletPoints.map(
              (bullet, index) => (
                <div key={index} className="space-y-2">
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-400">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Original:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {bullet.original}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Improved:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {bullet.improved}
                    </p>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Addressing Gaps */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Lightbulb className="h-5 w-5 text-purple-600" />
              Addressing Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.actionableRecommendations.addressingGaps.map(
                (gap, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {gap}
                    </span>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Final Checklist */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <CheckSquare className="h-5 w-5 text-green-600" />
            Final Checklist - Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300 font-medium mb-3">
              Complete these actions before submitting:
            </p>
            <ul className="space-y-2">
              {analysis.finalChecklist.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

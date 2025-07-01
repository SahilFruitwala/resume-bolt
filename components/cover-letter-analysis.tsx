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
  FileEdit,
  CheckSquare,
  Edit3,
  MessageSquare,
  Zap,
} from "lucide-react";
import { CoverLetterAnalysisDataType } from "@/lib/types";

interface CoverLetterAnalysisProps {
  analysis: CoverLetterAnalysisDataType;
}

export function CoverLetterAnalysis({
  analysis,
}: CoverLetterAnalysisProps) {
  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* All existing content remains exactly the same */}
        {/* Score Justification */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-gray-700 font-medium dark:text-gray-300">
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
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                {analysis.executiveSummary}
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                First Impression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                {analysis.firstImpression}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Structure Analysis */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-white">
                <CheckCircle className="h-5 w-5" />
                Structure Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.structureAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
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
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-white">
                <AlertTriangle className="h-5 w-5" />
                Structure Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.structureAnalysis.weaknesses.map(
                  (weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {weakness}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-white">
                <TrendingUp className="h-5 w-5" />
                Structure Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.structureAnalysis.recommendations.map(
                  (rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {rec}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Content Analysis */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <FileEdit className="h-5 w-5 text-purple-600" />
                Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-blue-600 mb-2 dark:text-gray-300">
                    Job Relevance
                  </h4>
                  <ul className="space-y-2">
                    {analysis.contentAnalysis.relevanceToJob.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start gap-2 dark:text-gray-300"
                        >
                          <Target className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-600 mb-2 dark:text-gray-300">
                    Value Proposition
                  </h4>
                  <ul className="space-y-2">
                    {analysis.contentAnalysis.valueProposition.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start gap-2 dark:text-gray-300"
                        >
                          <Zap className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-purple-600 mb-2 dark:text-gray-300">
                    Personality & Fit
                  </h4>
                  <ul className="space-y-2">
                    {analysis.contentAnalysis.personalityAndFit.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start gap-2 dark:text-gray-300"
                        >
                          <MessageSquare className="h-3 w-3 text-purple-500 mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-2 dark:text-gray-300">
                    Content Gaps
                  </h4>
                  <ul className="space-y-2">
                    {analysis.contentAnalysis.gaps.map((item, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start gap-2 dark:text-gray-300"
                      >
                        <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
              <h4 className="font-medium text-green-600 mb-2 dark:text-gray-300">
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
                        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      >
                        {keyword}
                      </Badge>
                    )
                  )
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    No keyword matches found
                  </span>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-2 dark:text-gray-300">
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
                        className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      >
                        {keyword}
                      </Badge>
                    )
                  )
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    All important keywords are present
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tone & Style */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Tone & Writing Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 dark:text-gray-300">
                Assessment
              </h4>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                {analysis.toneAndStyle.assessment}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-600 mb-2 dark:text-gray-300">
                Improvements
              </h4>
              <ul className="space-y-2">
                {analysis.toneAndStyle.improvements.map(
                  (improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {improvement}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Recommendations */}
        <div className="space-y-6">
          {/* Rewritten Opening */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Edit3 className="h-5 w-5 text-green-600" />
                Improved Opening Paragraph
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 dark:bg-green-900/20">
                <p className="text-gray-700 leading-relaxed italic dark:text-gray-300">
                  "{analysis.actionableRecommendations.rewrittenOpening}"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rewritten Closing */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Edit3 className="h-5 w-5 text-blue-600" />
                Improved Closing Paragraph
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 dark:bg-blue-900/20">
                <p className="text-gray-700 leading-relaxed italic dark:text-gray-300">
                  "{analysis.actionableRecommendations.rewrittenClosing}"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Suggestions */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                Content Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.actionableRecommendations.contentSuggestions.map(
                  (suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {suggestion}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Call to Action Improvement */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Target className="h-5 w-5 text-orange-600" />
                Enhanced Call-to-Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500 dark:bg-orange-900/20">
                <p className="text-gray-700 leading-relaxed italic dark:text-gray-300">
                  "{analysis.actionableRecommendations.callToActionImprovement}"
                </p>
              </div>
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
            <div className="bg-green-50 p-4 rounded-lg dark:bg-green-900/20">
              <p className="text-sm text-green-800 font-medium mb-3 dark:text-green-300">
                Complete these actions before submitting:
              </p>
              <ul className="space-y-2">
                {analysis.finalChecklist.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
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
    </>
  );
}

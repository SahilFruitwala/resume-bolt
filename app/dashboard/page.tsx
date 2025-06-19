"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { JobDescriptionInput } from "@/components/job-description-input";
import { LoadingState } from "@/components/loading-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Target, Zap, ArrowLeft, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ResumeAnalysis } from "@/components/analysis-results";

interface AnalysisData {
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

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
  if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
  return "bg-red-100 dark:bg-red-900/20";
};

export default function DashboardPage() {
  const [step, setStep] = useState<"upload" | "analyzing" | "results">(
    "upload"
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      // setError("Please enter a job description")
      return;
    }

    if (!resumeFile) {
      // setError("Please upload a resume PDF")
      return;
    }

    setIsAnalyzing(true);
    setStep("analyzing");

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

      const result = await response.json();
      setAnalysisData(result);
      setStep("results");
    } catch (err) {
      console.error("Analysis failed:", err);
      // setError(err instanceof Error ? err.message : "Failed to analyze resume. Please try again.")
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setResumeFile(null);
    setJobDescription("");
    setAnalysisData(null);
    setIsAnalyzing(false);
  };

  if (step === "analyzing") {
    return <LoadingState />;
  }

  if (step === "results" && analysisData) {
    console.clear();
    console.log("Analysis Data:", analysisData);
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className=" mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
          <div className="flex items-center justify-between mb-8">
            {/* <div className="flex items-center space-x-4"> */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Analysis Results
              </h1>
              <p className="text-gray-600">
                Comprehensive AI-powered resume analysis
              </p>
            </div>
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-full ${getScoreBgColor(
                analysisData.overallScore
              )}`}
            >
              <Star
                className={`h-6 w-6 ${getScoreColor(
                  analysisData.overallScore
                )}`}
              />
              <span
                className={`text-2xl font-bold ${getScoreColor(
                  analysisData.overallScore
                )}`}
              >
                {analysisData.overallScore}/100
              </span>
              {/* </div> */}
            </div>
          </div>
          <ResumeAnalysis analysis={analysisData} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Analysis
          </h1>
          <p className="text-gray-600">
            Upload your resume and job description to get AI-powered insights
            and recommendations.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4 bg-linear-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Skills Match
                </p>
                <p className="text-xs text-blue-600">Precision scoring</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-linear-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  ATS Optimization
                </p>
                <p className="text-xs text-green-600">System compatibility</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-linear-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-800">
                  Instant Analysis
                </p>
                <p className="text-xs text-purple-600">Real-time feedback</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-linear-to-r from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-orange-800">
                  AI Insights
                </p>
                <p className="text-xs text-orange-600">Smart recommendations</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FileUpload
              onFileSelect={setResumeFile}
              selectedFile={resumeFile}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
            />
          </motion.div>
        </div>

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button
            onClick={handleAnalyze}
            disabled={!resumeFile || !jobDescription.trim() || isAnalyzing}
            size="lg"
            className="px-12 py-4 text-lg font-semibold"
          >
            {isAnalyzing ? (
              <>
                <Brain className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-5 w-5" />
                Analyze Resume
              </>
            )}
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Analysis typically takes 30-60 seconds
          </p>
        </motion.div>
      </div>
    </div>
  );
}

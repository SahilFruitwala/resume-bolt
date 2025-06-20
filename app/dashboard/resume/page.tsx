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
import { getScoreBgColor, getScoreColor } from "@/lib/colors";
import { AnalysisDataType } from "@/lib/types";
import { analyzeResume } from "@/lib/ai-analyzer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function DashboardPage() {
  const [step, setStep] = useState<"upload" | "analyzing" | "results">(
    "upload"
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysisName, setAnalysisName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisDataType | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setStep("analyzing");

    try {
      const analysisData = await analyzeResume(
        resumeFile,
        jobDescription,
        analysisName
      );
      setAnalysisData(analysisData);
      setStep("results");
      toast.success("Resume analysis completed successfully!");
    } catch (err) {
      console.log("Error analyzing resume:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to analyze resume. Please try again."
      );
      // setError(err instanceof Error ? err.message : "Failed to analyze resume. Please try again.")
    } finally {
      setIsAnalyzing(false);
      setStep("upload");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setResumeFile(null);
    setJobDescription("");
    setAnalysisData(null);
    setIsAnalyzing(false);
    setAnalysisName("");
  };

  if (step === "analyzing") {
    return <LoadingState />;
  }

  if (step === "results" && analysisData) {
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
              <h1 className="text-3xl font-bold text-primary">
                Analysis Results
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
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
          <h1 className="text-3xl font-bold text-primary mb-2">
            Resume Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
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
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900 dark:to-blue-800 dark:border-blue-700">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 dark:text-blue-300 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Skills Match
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Precision scoring
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200 dark:from-green-900 dark:to-green-800 dark:border-green-700">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600 dark:text-green-300 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  ATS Optimization
                </p>
                <p className="text-xs text-green-600 dark:text-green-300">
                  System compatibility
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900 dark:to-purple-800 dark:border-purple-700">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-purple-600 dark:text-purple-300 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Instant Analysis
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-300">
                  Real-time feedback
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900 dark:to-orange-800 dark:border-orange-700">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-orange-600 dark:text-orange-300 mr-3" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  AI Insights
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-300">
                  Smart recommendations
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="grid w-full items-center gap-3"
            >
              <Label htmlFor="analysis name">Name</Label>
              <Input
                placeholder="Name of this analysis"
                value={analysisName}
                onChange={(e) => setAnalysisName(e.target.value)}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FileUpload
                onFileSelect={setResumeFile}
                selectedFile={resumeFile}
                type="resume"
              />
            </motion.div>
          </div>

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
            className="px-12 py-4 text-lg font-semibold transition-colors duration-200"
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Analysis typically takes 30-60 seconds
          </p>
        </motion.div>
      </div>
    </div>
  );
}

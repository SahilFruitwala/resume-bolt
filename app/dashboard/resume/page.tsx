"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { JobDescriptionInput } from "@/components/job-description-input";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft, Star } from "lucide-react";
import { ResumeAnalysis } from "@/components/resume-analysis";
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
      setStep("upload");
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
        <div
          // // initial={{ opacity: 0, y: -20 }}
          // // animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-primary mb-2">
            Resume Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload your resume and job description to get AI-powered insights
            and recommendations.
          </p>
        </div>


        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6 w-full">
            <div
              // initial={{ opacity: 0, x: -20 }}
              // animate={{ opacity: 1, x: 0 }}
              // transition={{ delay: 0.2 }}
              className="grid w-full items-center gap-3"
            >
              <Label htmlFor="analysis name">Name</Label>
              <Input
                placeholder="Name of this analysis"
                value={analysisName}
                onChange={(e) => setAnalysisName(e.target.value)}
              />
            </div>
            <div
              // initial={{ opacity: 0, x: -20 }}
              // animate={{ opacity: 1, x: 0 }}
              // transition={{ delay: 0.2 }}
            >
              <FileUpload
                onFileSelect={setResumeFile}
                selectedFile={resumeFile}
                type="resume"
              />
            </div>
          </div>

          <div
            // initial={{ opacity: 0, x: 20 }}
            // animate={{ opacity: 1, x: 0 }}
            // transition={{ delay: 0.3 }}
          >
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div
          // initial={{ opacity: 0, y: 20 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ delay: 0.4 }}
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
        </div>
      </div>
    </div>
  );
}

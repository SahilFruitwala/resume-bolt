"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { JobDescriptionInput } from "@/components/job-description-input";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft, Star } from "lucide-react";
import { getScoreBgColor, getScoreColor } from "@/lib/colors";
import { CoverLetterAnalysisDataType } from "@/lib/types";
import { analyzeCoverLetter } from "@/lib/ai-analyzer";
import { CoverLetterAnalysis } from "@/components/cover-letter-analysis";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoverLetterInput } from "@/components/cover-letter-text";

export default function DashboardPage() {
  const [step, setStep] = useState<"upload" | "analyzing" | "results">(
    "upload"
  );
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [analysisData, setAnalysisData] =
    useState<CoverLetterAnalysisDataType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisName, setAnalysisName] = useState("");

  const handleAnalyze = async () => {
    if ((!coverLetterFile && !coverLetter) || !jobDescription.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setStep("analyzing");

    try {
      const analysisData = await analyzeCoverLetter(
        coverLetterFile!,
        coverLetter,
        jobDescription,
        analysisName
      );
      setAnalysisData(analysisData);
      setStep("results");
      toast.success("Cover letter analyzed successfully!");
    } catch (err) {
      toast.error(
        "Failed to analyze cover letter. Please try again."
      );
      // setError(err instanceof Error ? err.message : "Failed to analyze resume. Please try again.")
      setStep("upload");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setCoverLetterFile(null);
    setJobDescription("");
    setCoverLetter("");
    setAnalysisData(null);
    setIsAnalyzing(false);
    setAnalysisName("");
  };

  if (step === "analyzing") {
    return <LoadingState isResume={false} />;
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
                Comprehensive AI-powered cover letter analysis
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
          <CoverLetterAnalysis analysis={analysisData} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-primary mb-2">
            Cover Letter Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload your cover letter and job description to get AI-powered
            insights and recommendations.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6 w-full">
            <div
              className="grid w-full items-center gap-3"
            >
              <Label htmlFor="analysis name">Name</Label>
              <Input
                placeholder="Name of this analysis"
                value={analysisName}
                onChange={(e) => setAnalysisName(e.target.value)}
              />
            </div>
            <Tabs defaultValue="pdf">
              <TabsList>
                <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
                <TabsTrigger value="text">Insert Text</TabsTrigger>
              </TabsList>
              <TabsContent value="pdf">
              <FileUpload
                onFileSelect={setCoverLetterFile}
                selectedFile={coverLetterFile}
                type="cover letter"
              />
            </TabsContent>
              <TabsContent value="text">
                <CoverLetterInput
                  value={coverLetter}
                  onChange={setCoverLetter}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div
          >
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div
          className="text-center"
        >
          <Button
            onClick={handleAnalyze}
            disabled={
              (!coverLetterFile && !coverLetter) || !jobDescription.trim() || isAnalyzing
            }
            size="lg"
            className="px-12 py-4 text-lg font-semibold transition-colors duration-200"
          >
            {isAnalyzing ? (
              <>
                <Brain className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Cover Letter...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-5 w-5" />
                Analyze Cover Letter
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

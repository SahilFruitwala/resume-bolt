"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { JobDescriptionInput } from "@/components/job-description-input";
import { LoadingState } from "@/components/loading-state";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  FileText,
  Target,
  Zap,
  ArrowLeft,
  Star,
  Clock,
  TrendingUp,
  Download,
  Eye,
  Calendar,
  Plus,
  FileEdit,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { ResumeAnalysis } from "@/components/analysis-results";
import { getScoreBgColor, getScoreColor } from "@/lib/colors";
import { AnalysisDataType } from "@/lib/types";
import { analyzeResume } from "@/lib/ai-analyzer";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const mockReports = [
  {
    id: 1,
    title: "Software Engineer - Google",
    date: "2025-01-15",
    score: 87,
    status: "completed",
    insights: 12,
    improvements: 5,
  },
  {
    id: 2,
    title: "Frontend Developer - Meta",
    date: "2025-01-14",
    score: 92,
    status: "completed",
    insights: 15,
    improvements: 3,
  },
  {
    id: 3,
    title: "Full Stack Developer - Microsoft",
    date: "2025-01-13",
    score: 78,
    status: "completed",
    insights: 10,
    improvements: 8,
  },
];

export default function DashboardPage() {
  const [step, setStep] = useState<"upload" | "analyzing" | "results">(
    "upload"
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);
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
      const analysisData = await analyzeResume(resumeFile, jobDescription);
      setAnalysisData(analysisData);
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 text-primary">My Reports</h1>
          <p className="text-muted-foreground">
            View and manage your resume analysis reports.
          </p>
        </motion.div>

        {/* Stats Overview */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        > */}
        <section
          aria-labelledby="stats-heading"
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-green-700">85.7</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-yellow-700">92</p>
                <p className="text-sm text-muted-foreground">Best Score</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-blue-700">2</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </Card>
        </section>
        {/* </motion.div> */}

        {/* Quick Actions */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        > */}
        <section aria-labelledby="quick-actions-heading" className="mb-8">
          <Card className="">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle
                id="quick-actions-heading"
                className="flex items-center gap-2 text-lg sm:text-xl dark:text-white"
              >
                <Plus
                  className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                  aria-hidden="true"
                />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Card className="p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer border-2 border-purple-200 dark:border-purple-800 group">
                  <Link href="/dashboard/resume">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                        <FileText
                          className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                          Analyze New Resume
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          Upload a resume and get comprehensive ATS analysis
                        </p>
                      </div>
                    </div>
                  </Link>
                </Card>

                <Card className="p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer border-2 border-purple-200 dark:border-purple-800 group">
                  <Link href="/dashboard/cover-letter">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30 transition-colors">
                        <FileEdit
                          className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                          Analyze New Cover Letter
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          Get feedback on tone, structure, and personalization
                        </p>
                      </div>
                    </div>
                  </Link>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>
        {/* </motion.div> */}

        <section aria-labelledby="tips-heading" className="mb-8">
          <h2 id="tips-heading" className="sr-only">
            Career Tips
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl dark:text-white">
                  <FileText
                    className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                    aria-hidden="true"
                  />
                  Resume Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 sm:space-y-3" role="list">
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Use keywords from the job description
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Quantify your achievements with numbers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Keep formatting simple for ATS compatibility
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl dark:text-white">
                  <FileEdit
                    className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600"
                    aria-hidden="true"
                  />
                  Cover Letter Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 sm:space-y-3" role="list">
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Personalize for each company and role
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Show enthusiasm and cultural fit
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Include a strong call-to-action
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Reports List */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {mockReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {report.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {report.insights} insights
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {report.improvements} improvements
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                        report.score
                      )}`}
                    >
                      {report.score}%
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="sr-only">View</span>
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        <span className="sr-only">Download</span>
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {mockReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary mb-2">
              No reports yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start by analyzing your first resume to see reports here.
            </p>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Analyze Resume
            </Button>
          </motion.div>
        )} */}
      </div>
    </div>
  );
}

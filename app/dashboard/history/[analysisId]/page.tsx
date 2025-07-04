"use client";

import { useParams } from "next/navigation";
import { CoverLetterAnalysis } from "@/components/cover-letter-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  FileWarning,
  Star,
  ArrowLeft,
} from "lucide-react"; // Added FileWarning
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ResumeAnalysis } from "@/components/resume-analysis";
import { getScoreBgColor, getScoreColor } from "@/lib/colors";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoadingSpinner from "@/components/loading-spinner";

// Error Message Component
const ErrorMessage = ({
  title,
  message,
  icon: Icon,
}: {
  title: string;
  message: string;
  icon: React.ElementType;
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <Alert variant="destructive" className="max-w-lg w-full">
      <Icon className="h-5 w-5" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  </div>
);

export default function AnalysisDetailPage() {
  const params = useParams();
  const analysisId = parseInt(params.analysisId as string, 10);

  const [analysisData, setAnalysisData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch analysis data using the analysisId from the URL
  const fetchAnalysis = async (analysisId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/history/${analysisId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Data fetching failed");
      }

      const { data } = await response.json();
      console.clear();
      console.log("Fetched analysis data:", data);
      setAnalysisData(data);
    } catch (error) {
      setAnalysisData(null);
      console.error("Error fetching history data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(analysisId);
  }, [analysisId]);

  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner message="Loading analysis details..." />;
  }

  // Handle case where analysis data is null (not found)
  if (!analysisData && !isLoading) {
    return (
      <ErrorMessage
        title="Analysis Not Found"
        message="The requested analysis could not be found. It might have been deleted or the ID is incorrect."
        icon={FileWarning}
      />
    );
  }

  let analysisContent;
  if (analysisData) {
    analysisContent = analysisData.forResume ? (
      <ResumeAnalysis analysis={analysisData.analysis} />
    ) : (
      <CoverLetterAnalysis analysis={analysisData.analysis} />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href={`/dashboard/history`}>
          <Button variant="outline" size="sm" className=" mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go to history
          </Button>
        </Link>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 dark:bg-muted/50 border-b">
          <CardTitle>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <h1 className="text-2xl font-semibold">{analysisData.title}</h1>
                <Badge variant="secondary" className="text-sm">
                  {analysisData.forResume ? "Resume" : "Cover Letter"}
                </Badge>
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
              </div>
            </div>
          </CardTitle>
          {/* <p className="text-sm text-gray-500 dark:text-gray-400">
            Analysis for: {analysisData.title}
          </p> */}
        </CardHeader>
        <CardContent className="p-6">{analysisContent}</CardContent>
      </Card>
    </div>
  );
}

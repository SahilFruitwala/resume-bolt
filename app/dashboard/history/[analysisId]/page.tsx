"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { CoverLetterAnalysis } from "@/components/cover-letter-analysis";
import { ResumeAnalysis } from "@/components/resume-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ServerCrash, FileWarning } from "lucide-react"; // Added FileWarning

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
    <p className="text-lg text-gray-600 dark:text-gray-400">Loading analysis details...</p>
  </div>
);

// Error Message Component
const ErrorMessage = ({ title, message, icon: Icon }: { title: string; message: string; icon: React.ElementType }) => (
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = params.analysisId as Id<"analysis">; // Cast to Convex Id

  // Fetch analysis data using the analysisId from the URL
  const analysisData = useQuery(api.analysis.getById, { id: analysisId });

  const handleReset = () => {
    const fromHistory = searchParams.get('from') === 'history';
    if (fromHistory) {
      router.push('/history');
    } else {
      // Default navigation based on analysis type
      if (analysisData && analysisData.type === "resume") {
        router.push('/resume');
      } else if (analysisData && analysisData.type === "cover-letter") {
        router.push('/cover-letter');
      } else {
        // Fallback if analysisData is not available yet, though unlikely in this handler
        router.push('/');
      }
    }
  };

  // Handle loading state
  if (analysisData === undefined) {
    return <LoadingSpinner />;
  }

  // Handle case where analysis data is null (not found)
  if (analysisData === null) {
    return (
      <ErrorMessage
        title="Analysis Not Found"
        message="The requested analysis could not be found. It might have been deleted or the ID is incorrect."
        icon={FileWarning}
      />
    );
  }

  // Handle potential error state if analysisData is an error object (though useQuery typically throws)
  // This is more of a defensive check if the API behavior changes or for robustness.
  if (analysisData instanceof Error) {
      return (
        <ErrorMessage
            title="Error Loading Analysis"
            message="An unexpected error occurred while trying to load the analysis details."
            icon={ServerCrash}
        />
    );
  }


  // Determine which component to render based on the analysis type
  const analysisContent =
    analysisData.type === "resume" ? (
      <ResumeAnalysis analysis={analysisData.analysis} onReset={handleReset} />
    ) : (
      <CoverLetterAnalysis analysis={analysisData.analysis} onReset={handleReset} />
    );

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 dark:bg-muted/50 border-b">
          <CardTitle className="text-2xl font-semibold">
            {analysisData.title}
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analysis for: {analysisData.company}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {analysisContent}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Eye,
  Calendar,
  FileEdit,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getScoreColor } from "@/lib/colors";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import LoadingSpinner from "@/components/loading-spinner";

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";

  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const fetchHistory = async (page: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/history?page=${page}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Data fetching failed");
      }

      const historyData = await response.json();
      setHistoryData(historyData.result);
      setHasMore(historyData.hasMore);
      // toast.success("History data fetched successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch history data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  if (isLoading && historyData.length === 0) {
    return <LoadingSpinner message="Fetching past analysis..." />;
  }
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 text-primary">My Reports</h1>
            <p className="text-muted-foreground">
              View and manage your resume analysis reports.
            </p>
          </div>

          {/* Reports List */}
          {historyData && (
            <div
              className="space-y-4"
            >
              {historyData.map((report, index) => (
                <div
                  key={report.id}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            {report.forResume ? (
                              <FileText className="h-6 w-6 text-primary" />
                            ) : (
                              <FileEdit className="h-6 w-6 text-primary" />
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            {report.title}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {report.createdAt}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {report.insights} insights
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {report.forResume ? "Resume" : "Cover Letter"}
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
                          <Link href={`/dashboard/history/${report.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="sr-only">View</span>
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </Link>
                          {/* <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          <span className="sr-only">Download</span>
                          <span className="hidden sm:inline">Download</span>
                        </Button> */}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}

              <div className="flex space-x-4">
                {page !== "1" && (
                  <Link href={`/dashboard/history?page=${Number(page) - 1}`}>
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}
                {hasMore && (
                  <Link href={`/dashboard/history?page=${Number(page) + 1}`}>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
          {/* Empty State (if no reports) */}
          {historyData.length === 0 && (
            <div
              className="text-center py-12"
            >
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">
                No reports yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start by analyzing your first resume to see reports here.
              </p>
              <Link href="/dashboard/resume">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Analyze Resume
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
}

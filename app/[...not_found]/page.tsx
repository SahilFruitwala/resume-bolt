"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
      <Card className="max-w-md w-full dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-red-600 dark:text-red-400">
            Something went wrong!
          </CardTitle>
        </CardHeader>
        <CardContent className="items-center text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            We encountered an unexpected error. Please try again.
          </p>
          <Link href="/" className="flex justify-center">
            <Button variant="link" className="flex space-x-2 text-md">
              <span>Go to Home</span>
              <Home className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

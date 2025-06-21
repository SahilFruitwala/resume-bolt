"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 bg-card border-b border-border shadow-xs">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
        {/* Page content */}
        <Suspense fallback={<div>Loading...</div>}>
          <main className="flex-1">{children}</main>
        </Suspense>
      </div>
    </div>
  );
}

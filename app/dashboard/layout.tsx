"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Settings,
  Menu,
  ScrollText,
  History,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Sidebar from "@/components/sidebar";

const navigation = [
  // { name: "Dashboard", href: "/dashboard", icon: ChartColumn },
  { name: "Analyze Resume", href: "/dashboard/resume", icon: FileText },
  {
    name: "Analyze Cover Letter",
    href: "/dashboard/cover-letter",
    icon: ScrollText,
  },
  {
    name: "History",
    href: "/dashboard/history",
    icon: History,
  },
  // { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  // { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const pathname = usePathname();

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
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

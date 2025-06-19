"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  FileText,
  Home,
  Settings,
  HelpCircle,
  Menu,
  X,
  User,
  BarChart3,
  ScrollText,
  History,
  BarChart,
  ChartColumn,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

const navigation = [
  // { name: "Dashboard", href: "/dashboard", icon: ChartColumn },
  { name: "Analyze Resume", href: "/dashboard/resume", icon: FileText },
  { name: "Analyze Cover Letter", href: "/dashboard/cover-letter", icon: ScrollText },
  {
    name: "History",
    href: "/dashboard/history",
    icon: History,
  },
  // { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  // { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  // { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  console.clear();
  console.log(pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="fixed inset-0 bg-muted/75"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold text-foreground">
                    ResumeBolt
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
              <nav className="mt-6 px-3">
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
          group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
          ${
            item.href === pathname
              ? "bg-primary/10 text-primary border-r-2 border-primary"
              : "text-foreground hover:bg-muted hover:text-foreground"
          }
          `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`
          mr-3 h-5 w-5 shrink-0
          ${
            item.href === pathname
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground"
          }
          `}
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col grow bg-card border-r border-border shadow-xs">
          <div className="flex h-16 items-center px-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                ResumeBolt
              </span>
            </Link>
          </div>
          <nav className="mt-6 flex-1 px-3">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
        group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${
          item.href === pathname
            ? "bg-primary/10 text-primary border-r-2 border-primary"
            : "text-foreground hover:bg-muted hover:text-foreground"
        }
        `}
                >
                  <item.icon
                    className={`
          mr-3 h-5 w-5 shrink-0
          ${
            item.href === pathname
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground"
          }
        `}
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* User profile section */}
          <div className="shrink-0 border-t border-border p-4">
            <Card className="p-3 bg-card">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    Guest User
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Free Plan
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

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
              {/* <Link
        href="/"
        className="ml-4 lg:ml-0 flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
        <Home className="mr-2 h-4 w-4" />
        Back to Home
        </Link> */}
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

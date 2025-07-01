"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  FileText,
  Settings,
  X,
  ScrollText,
  History,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useClerk } from '@clerk/nextjs'
import posthog from "posthog-js";

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
    href: "/dashboard/history?page=1",
    icon: History,
  },
  // { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  // { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk()

  return (
    <>
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
                          item.href.includes(pathname)
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
                            item.href.includes(pathname)
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
              <SignOutButton>
                <div className="group flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer text-foreground hover:bg-muted hover:text-foreground">
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent text-md font-medium"
                  >
                    Sign Out
                  </Button>
                  <LogOut className="mr-3 h-5 w-5 shrink-0 text-primary" />
                </div>
              </SignOutButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col grow bg-card border-r border-border shadow-xs">
          <div className="flex h-16 items-center px-6 border-b border-border">
            <Link
              href="/dashboard/resume"
              className="flex items-center space-x-2"
            >
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
                      item.href.includes(pathname)
                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                        : "text-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 shrink-0
                      ${
                        item.href.includes(pathname)
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
          <div className="shrink-0 border-t border-border">
            <Card className="p-3 bg-card">

              <Button
                variant="ghost"
                onClick={() => { 
                  posthog.reset();
                  signOut({ redirectUrl: '/' }) 
                }}
                className="flex space-x-4 items-center"
              >
                Sign out
                <LogOut className="ml-2 h-5 w-5 shrink-0 text-primary" />
              </Button>
              {/* <SignOutButton>
                <div className="group flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer text-foreground hover:bg-muted hover:text-foreground">
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent text-md font-medium"
                  >
                    Sign Out
                  </Button>
                  <LogOut className="mr-3 h-5 w-5 shrink-0 text-primary" />
                </div>
              </SignOutButton> */}
              {/* <div className="flex items-center">
                <UserButton
                  showName={true}
                  appearance={{
                    baseTheme: theme === "dark" ? dark : simple,
                  }}
                />
              </div> */}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  FileText, 
  Home, 
  Settings, 
  HelpCircle, 
  Menu,
  X,
  User,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';

const navigation = [
  { name: 'Analyze Resume', href: '/dashboard', icon: Brain, current: true },
  { name: 'My Reports', href: '/dashboard/reports', icon: FileText, current: false },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, current: false },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, current: false },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle, current: false },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
      {sidebarOpen && (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 lg:hidden"
        >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80" onClick={() => setSidebarOpen(false)} />
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl"
        >
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">ResumeBolt</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
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
              ${item.current
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon
              className={`
                mr-3 h-5 w-5 shrink-0
                ${item.current ? 'text-blue-500 dark:text-blue-300' : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}
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
      <div className="flex flex-col grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xs">
        <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">ResumeBolt</span>
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
            ${item.current
              ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-400'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            }
            `}
          >
            <item.icon
            className={`
              mr-3 h-5 w-5 shrink-0
              ${item.current ? 'text-blue-500 dark:text-blue-300' : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}
            `}
            />
            {item.name}
          </Link>
          ))}
        </div>
        </nav>
        
        {/* User profile section */}
        <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
        <Card className="p-3 bg-white dark:bg-gray-900">
          <div className="flex items-center">
          <div className="shrink-0">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Guest User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Free Plan</p>
          </div>
          </div>
        </Card>
        </div>
      </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
      {/* Top navigation */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-xs">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
          >
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>
          <Link
          href="/"
          className="ml-4 lg:ml-0 flex items-center text-sm text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
          >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {/* <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          View Sample
          </Button> */}
        </div>
        </div>
      </div>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>
      </div>
    </div>
  );
}
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  TrendingUp,
  Star,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const mockReports = [
  {
    id: 1,
    title: 'Software Engineer - Google',
    date: '2025-01-15',
    score: 87,
    status: 'completed',
    insights: 12,
    improvements: 5
  },
  {
    id: 2,
    title: 'Frontend Developer - Meta',
    date: '2025-01-14',
    score: 92,
    status: 'completed',
    insights: 15,
    improvements: 3
  },
  {
    id: 3,
    title: 'Full Stack Developer - Microsoft',
    date: '2025-01-13',
    score: 78,
    status: 'completed',
    insights: 10,
    improvements: 8
  }
];

export default function ReportsPage() {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 text-primary">
        My Reports
        </h1>
        <p className="text-muted-foreground">
        View and manage your resume analysis reports.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
      </motion.div>

      {/* Reports List */}
      <motion.div 
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
              <h3 className="text-lg font-semibold text-primary">{report.title}</h3>
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
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(report.score)}`}>
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

      {/* Empty State (if no reports) */}
      {mockReports.length === 0 && (
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center py-12"
        >
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-primary mb-2">No reports yet</h3>
        <p className="text-muted-foreground mb-6">
          Start by analyzing your first resume to see reports here.
        </p>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Analyze Resume
        </Button>
        </motion.div>
      )}
      </div>
    </div>
  );
}
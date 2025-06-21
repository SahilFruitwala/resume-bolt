"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Lock,
  Eye,
  Trash2,
  Download,
  Mail,
  ArrowLeft,
  FileText,
  Server,
  Users,
  Clock,
  Twitter,
  Linkedin,
  Brain,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const sections = [
  {
    id: "information-collection",
    title: "Information We Collect",
    icon: FileText,
    content: [
      {
        subtitle: "Resume Data",
        text: "When you upload your resume for analysis, we temporarily process the document content to provide our AI-powered insights. This includes text extraction, formatting analysis, and content evaluation.",
      },
      {
        subtitle: "Job Description Data",
        text: "We process the job descriptions you provide to compare against your resume and generate personalized recommendations.",
      },
      {
        subtitle: "Usage Information",
        text: "We collect basic usage analytics to improve our service, including analysis frequency, feature usage, and general performance metrics.",
      },
      {
        subtitle: "Technical Data",
        text: "Standard web information such as IP address, browser type, device information, and access times for security and optimization purposes.",
      },
    ],
  },
  {
    id: "data-processing",
    title: "How We Process Your Data",
    icon: Server,
    content: [
      {
        subtitle: "AI Analysis",
        text: "Your resume and job description data are processed by our AI systems (Google Gemini) to generate personalized insights and recommendations.",
      },
      {
        subtitle: "Temporary Processing",
        text: "Resume content is processed in real-time and is not permanently stored on our servers after analysis completion.",
      },
      //   {
      //     subtitle: "Security Measures",
      //     text: "All data processing occurs through encrypted connections and secure cloud infrastructure with industry-standard security protocols.",
      //   },
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention & Storage",
    icon: Clock,
    content: [
      {
        subtitle: "Resume Files",
        text: "Uploaded resume files are automatically deleted from our servers within 24 hours of analysis completion.",
      },
      {
        subtitle: "Analysis Results",
        text: "Analysis reports may be temporarily cached for up to 30 days to improve performance, then automatically purged.",
      },
      {
        subtitle: "Usage Analytics",
        text: "Anonymized usage statistics are retained for up to 2 years for service improvement purposes.",
      },
    ],
  },
  {
    id: "data-sharing",
    title: "Data Sharing & Third Parties",
    icon: Users,
    content: [
      {
        subtitle: "AI Processing Partners",
        text: "We use Google's Gemini AI service for resume analysis. Data is processed according to Google's privacy policies and security standards.",
      },
      {
        subtitle: "No Sale of Personal Data",
        text: "We do not sell, rent, or trade your personal information or resume data to third parties for marketing purposes.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose information if required by law, court order, or to protect our rights and the safety of our users.",
      },
    ],
  },
  {
    id: "user-rights",
    title: "Your Rights & Controls",
    icon: Shield,
    content: [
      {
        subtitle: "Data Access",
        text: "You can request information about what personal data we have processed about you.",
      },
      {
        subtitle: "Data Deletion",
        text: "You can request deletion of your data at any time. Resume files are automatically deleted within 24 hours.",
      },
      {
        subtitle: "Data Portability",
        text: "You can download your analysis reports and any data we have about you in a machine-readable format.",
      },
      {
        subtitle: "Opt-Out",
        text: "You can opt out of non-essential data collection and analytics at any time.",
      },
    ],
  },
  {
    id: "security",
    title: "Security Measures",
    icon: Lock,
    content: [
      {
        subtitle: "Encryption",
        text: "All data transmission is encrypted using TLS/SSL protocols. Data at rest is encrypted using industry-standard encryption methods.",
      },
      {
        subtitle: "Access Controls",
        text: "Strict access controls ensure only authorized personnel can access systems, with all access logged and monitored.",
      },
      {
        subtitle: "Regular Audits",
        text: "We conduct regular security audits and vulnerability assessments to maintain the highest security standards.",
      },
      {
        subtitle: "Incident Response",
        text: "We have established procedures for detecting, responding to, and reporting any security incidents.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-xs sticky top-0 z-50 transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  ResumeBolt
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>
              <Link href="/dashboard/resume">
                <Button>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <ThemeToggle />
              {/* <div className="space-x-4 flex items-center">
                <Link href="/dashboard/resume">
                  <Button>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div> */}
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy. This is just an MVP.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your privacy is our priority. This policy explains how we collect,
            use, and protect your information when you use our AI-powered resume
            analysis service.
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Last updated: January 15, 2025</p>
            <p>Effective date: January 15, 2025</p>
          </div>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-8 bg-card border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
              <Eye className="mr-3 h-6 w-6 text-accent" />
              Privacy at a Glance
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Auto-Delete
                </h3>
                <p className="text-sm text-muted-foreground">
                  Resume files deleted within 24 hours
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Encrypted
                </h3>
                <p className="text-sm text-muted-foreground">
                  All data encrypted in transit and at rest
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  No Selling
                </h3>
                <p className="text-sm text-muted-foreground">
                  We never sell your personal data
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Your Control
                </h3>
                <p className="text-sm text-muted-foreground">
                  Download or delete your data anytime
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
            >
              <Card className="p-8 bg-card border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <section.icon className="mr-3 h-6 w-6 text-primary" />
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {item.subtitle}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.text}
                      </p>
                      {itemIndex < section.content.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card className="p-8 bg-card border-border">
            <div className="text-center">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                If you have any questions about this Privacy Policy, your data
                rights, or how we handle your information, please don't hesitate
                to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="https://www.linkedin.com/in/sahilfruitwala/">
                  <Button size="lg">
                    <Linkedin className="mr-2 h-5 w-5" />
                    Contact on LinkedIn
                  </Button>
                </Link>
                <Link href="http://x.com/sahil_Fruitwala">
                  <Button size="lg" variant="outline">
                    <Twitter className="mr-2 h-5 w-5" />
                    Request My Data
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="bg-muted rounded-lg p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Changes to This Policy:</strong> We may update this
              Privacy Policy from time to time. We will notify you of any
              material changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date. We encourage you to review
              this Privacy Policy periodically for any changes.
            </p>
          </div>
        </motion.div>
      </div>
      <footer className="bg-background text-foreground py-12 transition-colors border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">ResumeBolt</span>
              </Link>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2025 ResumeBolt. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

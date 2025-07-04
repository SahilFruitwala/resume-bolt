'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  FileText,
  Target,
  Zap,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Upload,
  Search,
  TrendingUp,
  Award,
  Lock,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { PricingTable, SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/theme-toggle';
import HeaderComponent from '@/components/header';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderComponent />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge variant="secondary" className="mb-4">
              🚀 AI-Powered Career Optimization
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              Transform Your Job Applications with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant, intelligent analysis of your resume and cover letters.
              ResumeBolt provides personalized feedback and optimization suggestions to help you land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <SignedOut>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {/* <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Watch Demo
                </Button> */}
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </SignedIn>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-chart-2" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-chart-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-chart-2" />
                <span>Instant results</span>
              </div>
            </div>
            <div className="mt-16 text-center flex justify-center">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center -space-x-2 justify-center">
                  {['m', 'y', 'f', 'r', 'i', 'e', 'n', 'd', 's'].map((char, idx) => (
                    <div
                      key={char + idx}
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-bold border-2 border-background
                  ${[
                          'bg-chart-1 text-white',
                          'bg-chart-2 text-white',
                          'bg-chart-3 text-white',
                          'bg-chart-4 text-white',
                          'bg-chart-5 text-white',
                          'bg-primary text-primary-foreground',
                          'bg-secondary text-secondary-foreground',
                          'bg-accent text-accent-foreground',
                          'bg-muted text-foreground'
                        ][idx]
                        }
                `}
                    >
                      {char}
                    </div>
                  ))}
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-1 mb-2">
                    <Star className="h-5 w-5 text-chart-4 fill-current" />
                    <Star className="h-5 w-5 text-chart-4 fill-current" />
                    <Star className="h-5 w-5 text-chart-4 fill-current" />
                    <Star className="h-5 w-5 text-chart-4 fill-current" />
                    <Star className="h-5 w-5 text-chart-4 fill-current" />
                    <span className="text-sm text-muted-foreground ml-2">4.9/5 rating</span>
                  </div>
                  <p className="text-base sm:text-lg font-semibold">My friends love this app</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful AI-Driven Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI analyzes every aspect of your application materials to give you the competitive edge you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-chart-1/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-1/20 transition-colors">
                  <Brain className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle>Intelligent Analysis</CardTitle>
                <CardDescription>
                  Advanced AI algorithms analyze your resume content, structure, and formatting to identify improvement opportunities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-chart-2/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-2/20 transition-colors">
                  <Target className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle>Job Match Optimization</CardTitle>
                <CardDescription>
                  Compare your resume against job descriptions to optimize keyword usage and improve ATS compatibility.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-chart-5/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-5/20 transition-colors">
                  <FileText className="h-6 w-6 text-chart-5" />
                </div>
                <CardTitle>Cover Letter Enhancement</CardTitle>
                <CardDescription>
                  Get personalized suggestions to make your cover letters more compelling and tailored to specific roles.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-4/20 transition-colors">
                  <Zap className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle>Instant Feedback</CardTitle>
                <CardDescription>
                  Receive immediate, actionable feedback with specific recommendations for improvement and optimization.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-3/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>Performance Tracking</CardTitle>
                <CardDescription>
                  Track your improvement over time with detailed analytics and performance metrics for your applications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                  <Award className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Industry Standards</CardTitle>
                <CardDescription>
                  Ensure your resume meets current industry standards and best practices across different fields and roles.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How ResumeBolt Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get professional-grade analysis in three simple steps. No complex setup required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="h-20 w-20 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Documents</h3>
              <p className="text-muted-foreground">
                Simply upload your resume and cover letter. We support all major file formats including PDF, Word, and text files.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="h-20 w-20 bg-gradient-to-r from-chart-2 to-chart-3 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes your content, structure, keywords, and formatting against industry best practices and job requirements.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="h-20 w-20 bg-gradient-to-r from-chart-4 to-chart-5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Actionable Insights</h3>
              <p className="text-muted-foreground">
                Receive detailed feedback, optimization suggestions, and a comprehensive score to improve your job application success rate.
              </p>
            </div>
          </div>

          {/* <div className="text-center mt-12">
            <Button size="lg">
              Start Your Free Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </section>

      {/* Trust & Security Section */}
      <section id="security" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your Privacy & Security Matter</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We take data security seriously. Your documents are processed securely and never stored permanently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-chart-2 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Secure Processing</h3>
                <p className="text-sm text-muted-foreground">
                  End-to-end encryption protects your data during analysis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <Lock className="h-12 w-12 text-chart-1 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Permanent Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Your resumes and job descriptions are never stored
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-chart-5 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Full compliance with data protection regulations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-chart-4 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Trusted by My Friends</h3>
                <p className="text-sm text-muted-foreground">
                  Over 10,000 professionals trust ResumeBolt
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-chart-1 to-chart-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Job Applications?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already improved their job prospects with ResumeBolt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {/* <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Watch Demo
                </Button> */}
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  variant={"secondary"}
                  size="lg"
                  className="w-full sm:w-auto transition-colors duration-200 hover:bg-secondary/80 hover:shadow-lg"
                >
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </SignedIn>
            <Link href="https://www.linkedin.com/in/sahilfruitwala/" target='_blank'>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 dark:hover:bg-white/30"
              >
                Contact Sahil Directly
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-4">
              <span className={billing === 'monthly' ? "font-bold text-primary" : "text-muted-foreground"}>Monthly</span>
              <button
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${billing === 'yearly' ? 'bg-primary/80' : 'bg-muted'}`}
                onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                aria-label="Toggle billing period"
              >
                <span
                  className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${billing === 'yearly' ? 'translate-x-6' : ''}`}
                />
              </button>
              <span className={billing === 'yearly' ? "font-bold text-primary" : "text-muted-foreground"}>Yearly</span>
              {billing === 'yearly' && (
                <span className="ml-3 px-2 py-0.5 rounded bg-chart-2/10 text-chart-2 text-xs font-semibold animate-fade-in">
                  Save Upto 45%
                </span>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="text-center border-2 border-chart-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-chart-3 bg-white dark:bg-zinc-900">
              <CardHeader>
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-4xl font-extrabold mb-2">$0</p>
                <p className="text-muted-foreground mb-4">Always free, no credit card needed</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="transition-all duration-200 hover:text-chart-2"><CheckCircle className="inline h-4 w-4 text-chart-2 mr-2" />Basic AI resume analysis</li>
                  <li className="transition-all duration-200 hover:text-chart-2"><CheckCircle className="inline h-4 w-4 text-chart-2 mr-2" />Cover letter feedback</li>
                  <li className="transition-all duration-200 hover:text-chart-2"><CheckCircle className="inline h-4 w-4 text-chart-2 mr-2" />3 analyses per month</li>
                </ul>
                <SignedOut>
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">Get Started</Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" variant="secondary">Go to Dashboard</Button>
                  </Link>
                </SignedIn>
              </CardContent>
            </Card>
            {/* Premium+ Plan (center) */}
            <Card className="text-center border-2 border-chart-5 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:border-chart-4 bg-white dark:bg-zinc-900 scale-105 z-10">
              <CardHeader>
                <h3 className="text-2xl font-bold mb-2 text-chart-5 dark:text-chart-4">Premium+</h3>
                <div className="flex flex-col items-center mb-2">
                  {billing === 'yearly' && (
                    <span className="mb-2 px-3 py-1 rounded-full bg-chart-5/10 text-chart-5 dark:bg-chart-4/20 dark:text-chart-4 text-xs font-semibold animate-fade-in">
                      Best Value – Save 45%
                    </span>
                  )}
                  <p className="text-4xl font-extrabold text-chart-5 dark:text-chart-4 transition-all duration-300 flex items-end gap-2">
                    {billing === 'monthly' ? (
                      <>
                        <span>$29.99</span>
                        <span className="text-lg font-medium text-muted-foreground mb-1">/mo</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-medium text-muted-foreground line-through mr-2">$29.99</span>
                        <span>$16.50</span>
                        <span className="text-lg font-medium text-muted-foreground mb-1">/yr</span>
                      </>
                    )}
                  </p>
                </div>
                <p className="text-muted-foreground mb-4">Built for job seekers who mean business</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="transition-all duration-200 hover:text-chart-5 dark:hover:text-chart-4"><CheckCircle className="inline h-4 w-4 text-chart-5 dark:text-chart-4 mr-2" />Everything in Premium</li>
                  <li className="transition-all duration-200 hover:text-chart-5 dark:hover:text-chart-4"><CheckCircle className="inline h-4 w-4 text-chart-5 dark:text-chart-4 mr-2" />1:1 expert review (monthly)</li>
                  <li className="transition-all duration-200 hover:text-chart-5 dark:hover:text-chart-4"><CheckCircle className="inline h-4 w-4 text-chart-5 dark:text-chart-4 mr-2" />Personalized job alerts</li>
                  <li className="transition-all duration-200 hover:text-chart-5 dark:hover:text-chart-4"><CheckCircle className="inline h-4 w-4 text-chart-5 dark:text-chart-4 mr-2" />Early access to new features</li>
                </ul>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" variant="outline">
                    Try Premium+ — Maximize Your Results
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Premium Plan */}
            <Card className="text-center border-2 border-primary shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-chart-1 bg-gradient-to-br from-primary/10 to-white dark:from-primary/30 dark:to-zinc-900 dark:bg-zinc-900">
              <CardHeader>
                <h3 className="text-2xl font-bold mb-2 text-primary dark:text-primary-300">Premium</h3>
                <div className="flex flex-col items-center mb-2">
                  {billing === 'yearly' && (
                    <span className="mb-2 px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-200 text-xs font-semibold animate-fade-in">
                      Save 29%
                    </span>
                  )}
                  <p className="text-4xl font-extrabold text-primary dark:text-primary-200 transition-all duration-300 flex items-end gap-2">
                    {billing === 'monthly' ? (
                      <>
                        <span>$16.99</span>
                        <span className="text-lg font-medium text-muted-foreground mb-1">/mo</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-medium text-muted-foreground line-through mr-2">$16.99</span>
                        <span>$12.06</span>
                        <span className="text-lg font-medium text-muted-foreground mb-1">/yr</span>
                      </>
                    )}
                  </p>
                </div>
                <p className="text-muted-foreground mb-4">Land more interviews, faster</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="transition-all duration-200 hover:text-primary"><CheckCircle className="inline h-4 w-4 text-primary mr-2" />Unlimited analyses</li>
                  <li className="transition-all duration-200 hover:text-primary"><CheckCircle className="inline h-4 w-4 text-primary mr-2" />Advanced AI suggestions</li>
                  <li className="transition-all duration-200 hover:text-primary"><CheckCircle className="inline h-4 w-4 text-primary mr-2" />Job match optimization</li>
                  <li className="transition-all duration-200 hover:text-primary"><CheckCircle className="inline h-4 w-4 text-primary mr-2" />Priority support</li>
                </ul>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" variant="default">
                    Get Smarter Matches Today
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">ResumeBolt</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Intelligent resume and cover letter analysis powered by advanced AI technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                {/* <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li> */}
              </ul>
            </div>
            {/* <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div> */}
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                {/* <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GDPR</a></li> */}
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 ResumeBolt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
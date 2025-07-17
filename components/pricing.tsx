"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4">
            <span
              className={
                billing === "monthly"
                  ? "font-bold text-primary"
                  : "text-muted-foreground"
              }
            >
              Monthly
            </span>
            <button
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${
                billing === "yearly" ? "bg-primary/80" : "bg-muted"
              }`}
              onClick={() =>
                setBilling(billing === "monthly" ? "yearly" : "monthly")
              }
              aria-label="Toggle billing period"
            >
              <span
                className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${
                  billing === "yearly" ? "translate-x-6" : ""
                }`}
              />
            </button>
            <span
              className={
                billing === "yearly"
                  ? "font-bold text-primary"
                  : "text-muted-foreground"
              }
            >
              Yearly
            </span>
            {billing === "yearly" && (
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
              <p className="text-muted-foreground mb-4">
                Always free, no credit card needed
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="transition-all duration-200 hover:text-chart-2">
                  <CheckCircle className="inline h-4 w-4 text-chart-2 mr-2" />
                  Basic AI resume analysis
                </li>
                <li className="transition-all duration-200 hover:text-chart-2">
                  <CheckCircle className="inline h-4 w-4 text-chart-2 mr-2" />
                  Cover letter feedback
                </li>
                <li className="transition-all duration-200 hover:text-chart-2">
                  <CheckCircle className="inline h-4 w-4 text-chart-2 mr-2" />3
                  analyses per month
                </li>
              </ul>
              <SignedOut>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    variant="secondary"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </CardContent>
          </Card>
          {/* Premium+ Plan (center) */}
          <Card className="text-center border-2 border-chart-5 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:border-chart-4 bg-white dark:bg-zinc-900 scale-105 z-10">
            <CardHeader>
              <h3 className="text-2xl font-bold mb-2 text-chart-5 dark:text-chart-4">
                Premium+
              </h3>
              <div className="flex flex-col items-center mb-2">
                {billing === "yearly" && (
                  <span className="mb-2 px-3 py-1 rounded-full bg-chart-5/10 text-chart-5 dark:bg-chart-4/20 dark:text-chart-4 text-xs font-semibold animate-fade-in">
                    Best Value – Save 45%
                  </span>
                )}
                <p className="text-4xl font-extrabold text-chart-5 dark:text-chart-4 transition-all duration-300 flex items-end gap-2">
                  {billing === "monthly" ? (
                    <>
                      <span>$29.99</span>
                      <span className="text-lg font-medium text-muted-foreground mb-1">
                        /mo
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-medium text-muted-foreground line-through mr-2">
                        $29.99
                      </span>
                      <span>$16.50</span>
                      <span className="text-lg font-medium text-muted-foreground mb-1">
                        /yr
                      </span>
                    </>
                  )}
                </p>
              </div>
              <p className="text-muted-foreground mb-4">
                Built for job seekers who mean business
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="transition-all duration-200 hover:text-chart-5 dark:hover:text-chart-4">
                  <CheckCircle className="inline h-4 w-4 text-chart-5 dark:text-chart-4 mr-2" />
                  Everything in Premium
                </li>
                <li className="transition-all duration-200 hover:text-chart-5 dark:hover:text-chart-4">
                  <CheckCircle className="inline h-4 w-4 text-chart-5 dark:text-chart-4 mr-2" />
                  1:1 expert review (monthly)
                </li>
                <li className="transition-all duration-200 hover:text-chart-5 dark:hover:text-chart-4">
                  <CheckCircle className="inline h-4 w-4 text-chart-5 dark:text-chart-4 mr-2" />
                  Personalized job alerts
                </li>
                <li className="transition-all duration-200 hover:text-chart-5 dark:hover:text-chart-4">
                  <CheckCircle className="inline h-4 w-4 text-chart-5 dark:text-chart-4 mr-2" />
                  Early access to new features
                </li>
              </ul>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  variant="outline"
                >
                  Try Premium+ — Maximize Your Results
                </Button>
              </Link>
            </CardContent>
          </Card>
          {/* Premium Plan */}
          <Card className="text-center border-2 border-primary shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-chart-1 bg-gradient-to-br from-primary/10 to-white dark:from-primary/30 dark:to-zinc-900 dark:bg-zinc-900">
            <CardHeader>
              <h3 className="text-2xl font-bold mb-2 text-primary dark:text-primary-300">
                Premium
              </h3>
              <div className="flex flex-col items-center mb-2">
                {billing === "yearly" && (
                  <span className="mb-2 px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-200 text-xs font-semibold animate-fade-in">
                    Save 29%
                  </span>
                )}
                <p className="text-4xl font-extrabold text-primary dark:text-primary-200 transition-all duration-300 flex items-end gap-2">
                  {billing === "monthly" ? (
                    <>
                      <span>$16.99</span>
                      <span className="text-lg font-medium text-muted-foreground mb-1">
                        /mo
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-medium text-muted-foreground line-through mr-2">
                        $16.99
                      </span>
                      <span>$12.06</span>
                      <span className="text-lg font-medium text-muted-foreground mb-1">
                        /yr
                      </span>
                    </>
                  )}
                </p>
              </div>
              <p className="text-muted-foreground mb-4">
                Land more interviews, faster
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="transition-all duration-200 hover:text-primary">
                  <CheckCircle className="inline h-4 w-4 text-primary mr-2" />
                  Unlimited analyses
                </li>
                <li className="transition-all duration-200 hover:text-primary">
                  <CheckCircle className="inline h-4 w-4 text-primary mr-2" />
                  Advanced AI suggestions
                </li>
                <li className="transition-all duration-200 hover:text-primary">
                  <CheckCircle className="inline h-4 w-4 text-primary mr-2" />
                  Job match optimization
                </li>
                <li className="transition-all duration-200 hover:text-primary">
                  <CheckCircle className="inline h-4 w-4 text-primary mr-2" />
                  Priority support
                </li>
              </ul>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  variant="default"
                >
                  Get Smarter Matches Today
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

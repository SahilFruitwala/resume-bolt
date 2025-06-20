import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://jobmatchpro.com"),
  title: {
    default: "JobMatchPro - AI Career Coach | Resume & Cover Letter Analysis",
    template: "%s | JobMatchPro",
  },
  description:
    "Professional AI-powered resume and cover letter analysis with actionable feedback to optimize your job applications for ATS systems and land more interviews.",
  keywords: [
    "resume analysis",
    "cover letter analysis",
    "ATS optimization",
    "job application",
    "career coach",
    "AI resume review",
    "applicant tracking system",
    "job search",
    "interview preparation",
    "career development",
    "resume optimization",
    "job matching",
    "professional development",
    "career guidance",
    "resume writing",
  ],
  authors: [{ name: "JobMatchPro", url: "https://jobmatchpro.com" }],
  creator: "JobMatchPro",
  publisher: "JobMatchPro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jobmatchpro.com",
    title: "JobMatchPro - AI Career Coach | Resume & Cover Letter Analysis",
    description:
      "Professional AI-powered resume and cover letter analysis with actionable feedback to optimize your job applications for ATS systems and land more interviews.",
    siteName: "JobMatchPro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JobMatchPro - AI Career Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JobMatchPro - AI Career Coach | Resume & Cover Letter Analysis",
    description:
      "Professional AI-powered resume and cover letter analysis with actionable feedback to optimize your job applications for ATS systems and land more interviews.",
    images: ["/og-image.jpg"],
    creator: "@JobMatchPro",
    site: "@JobMatchPro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://jobmatchpro.com",
  },
  category: "technology",
  generator: "v0.dev",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JobMatchPro",
  description:
    "Professional AI-powered resume and cover letter analysis with actionable feedback to optimize your job applications for ATS systems and land more interviews.",
  url: "https://jobmatchpro.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "JobMatchPro",
    url: "https://jobmatchpro.com",
  },
  featureList: [
    "AI-powered resume analysis",
    "Cover letter optimization",
    "ATS compatibility checking",
    "Keyword optimization",
    "Actionable feedback",
    "Progress tracking",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
            <Toaster richColors/>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

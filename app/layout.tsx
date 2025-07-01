import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://resumebolt.thehalfbakedlab.com"),
  title: {
    default: "ResumeBolt - AI Career Coach | Resume & Cover Letter Analysis",
    template: "%s | ResumeBolt",
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
  authors: [{ name: "ResumeBolt", url: "https://resumebolt.thehalfbakedlab.com" }],
  creator: "ResumeBolt",
  publisher: "ResumeBolt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resumebolt.thehalfbakedlab.com",
    title: "ResumeBolt - AI Career Coach | Resume & Cover Letter Analysis",
    description:
      "Professional AI-powered resume and cover letter analysis with actionable feedback to optimize your job applications for ATS systems and land more interviews.",
    siteName: "ResumeBolt",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ResumeBolt - AI Career Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeBolt - AI Career Coach | Resume & Cover Letter Analysis",
    description:
      "Professional AI-powered resume and cover letter analysis with actionable feedback to optimize your job applications for ATS systems and land more interviews.",
    images: ["/og-image.jpg"],
    creator: "@ResumeBolt",
    site: "@ResumeBolt",
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
    canonical: "https://resumebolt.thehalfbakedlab.com",
  },
  category: "technology",
  generator: "v0.dev",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ResumeBolt",
  description:
    "Professional AI-powered resume and cover letter analysis with actionable feedback to optimize your job applications for ATS systems and land more interviews.",
  url: "https://resumebolt.thehalfbakedlab.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "ResumeBolt",
    url: "https://resumebolt.thehalfbakedlab.com",
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
              <Toaster richColors />
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

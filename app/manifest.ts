import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ResumeBolt - AI Career Coach",
    short_name: "ResumeBolt",
    description:
      "Professional AI-powered resume and cover letter analysis with actionable feedback to optimize your job applications for ATS systems and land more interviews.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["business", "productivity", "education"],
    lang: "en",
    orientation: "portrait-primary",
  };
}

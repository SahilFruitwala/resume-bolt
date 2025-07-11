/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/dashboard',
        destination: '/dashboard/resume',
        permanent: true,
      },
      // by default when we change plan clerk is trying to redirect to the plans page
      // but we want to redirect to the settings page
      {
        source: '/dashboard/settings/billing/plans',
        destination: '/dashboard/settings',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ]
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import logger from "@/lib/logger";
import { PostHog } from "posthog-node";

const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
});

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/waitlist(.*)",
  "/privacy",
  "/api/webhooks/clerk", // Public webhook route
]);

export default clerkMiddleware(async (auth, req) => {
  const {userId} = await auth()
  try {
    if (!isPublicRoute(req)) {
      logger.info(`Protected route accessed: ${req.url}`);
      await auth.protect();
      if (userId) {
        posthogClient.identify({
          distinctId: userId,
        });
        posthogClient.capture({
          distinctId: userId,
          event: "user_signed_in",
        });
      }
    }
  } finally {
    await posthogClient.shutdown();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

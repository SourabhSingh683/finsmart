import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Simple route matcher function
function isProtectedRoute(req) {
  const path = req.nextUrl.pathname;
  return (
    path.startsWith("/dashboard") ||
    path.startsWith("/account") ||
    path.startsWith("/transaction")
  );
}

// Create Arcjet middleware
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  // characteristics: ["userId"], // Track based on Clerk userId
  rules: [
    // Shield protection for content and security
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "GO_HTTP", // For Inngest
        // See the full list at https://arcjet.com/bot-list
      ],
    }),
  ],
});

// Create Clerk auth middleware
const clerk = authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up", "/api/webhook"],
  afterAuth(auth, req) {
    // If user isn't authenticated and tries to access a private route
    if (!auth.userId && isProtectedRoute(req)) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  },
});

// Chain middlewares - ArcJet runs first, then Clerk
export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

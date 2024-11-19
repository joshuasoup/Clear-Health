import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms-of-use',
  '/pricing',
  '/roadmap',
  '/api/webhooks/(.*)',
  '/assets/(.*)',
  '/api/reset-token',
]);

export default clerkMiddleware(async (auth, request) => {
  try {
    if (!isPublicRoute(request)) {
      // Protect the route and return the response
      await auth.protect();
    } 
  } catch (error) {
    // Log the error to the console
    console.error('Error in middleware:', error);
    // Redirect the user to the homepage
    return NextResponse.redirect(new URL('/', request.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

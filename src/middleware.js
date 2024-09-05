import { authMiddleware } from "@clerk/nextjs";

export default async function middleware(req) {
  console.log('Incoming request:', req.url);
  try {
    return await authMiddleware({

      publicRoutes: ["/", "/pricing", "/about"],
      ignoredRoutes: ["/((?!api|trpc))(_next.*|.+\.[\\w]+$)", "/api/reset-token"],
    })(req);
  } catch (error) {
    console.error('Middleware error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
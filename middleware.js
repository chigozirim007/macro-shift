export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - signin (public auth pages)
     * - signup (public auth pages)
     * - / (landing page is public)
     */
    "/account/:path*",
    // Add other protected routes here
    // "/trends/:path*", 
  ],
}

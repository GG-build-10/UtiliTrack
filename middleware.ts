import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Check for user email cookie
  const userEmail = req.cookies.get("user-email")?.value
  const isAuthenticated = !!userEmail

  const isAuthPage = req.nextUrl.pathname === "/auth"
  const isRootPage = req.nextUrl.pathname === "/"

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isAuthPage && !isRootPage) {
    const redirectUrl = new URL("/", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is authenticated and trying to access the auth page
  if (isAuthenticated && isAuthPage) {
    const redirectUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

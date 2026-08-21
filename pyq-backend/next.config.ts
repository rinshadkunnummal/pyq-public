import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const allowedOrigins = [
  "https://pyq-frontend-iota.vercel.app",
  "https://ubiquitous-goggles-v6gpvgww4gr7cwqq5-5173.app.github.dev",
]

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin")

  const response = NextResponse.next()

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    )
  }

  return response
}

export const config = {
  matcher: "/api/:path*",
}
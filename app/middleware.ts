import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const path = req.nextUrl.pathname

  // 🔒 Protege /products
  if (path.startsWith("/products") && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 🔁 Evita acessar login estando logado
  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/products", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/products/:path*", "/login"],
}

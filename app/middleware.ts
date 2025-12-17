import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // 🔒 Protege /products
  if (pathname.startsWith("/products") && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 🔁 Impede acessar /login estando logado
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/products", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/products/:path*", "/login"],
}

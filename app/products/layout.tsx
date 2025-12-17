"use client"

import { ReactNode } from "react"
import { ProductsProvider } from "../../hooks/useProducts"

export default function ProductsLayout({
  children,
}: {
  children: ReactNode
}) {
  return <ProductsProvider>{children}</ProductsProvider>
}

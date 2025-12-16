import * as React from "react"
import { cn } from "@/lib/utils"

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        rounded-3xl
        border border-zinc-700
        bg-zinc-900/70
        backdrop-blur-xl
        shadow-2xl
        `,
        className
      )}
      {...props}
    />
  )
}

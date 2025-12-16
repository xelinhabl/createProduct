import * as React from "react"
import { cn } from "@/lib/utils"

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <div className="relative group">
      {/* Glow */}
      <div
        className="
          pointer-events-none
          absolute -inset-0.5
          rounded-2xl
          bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-fuchsia-500/40
          opacity-0
          blur
          transition
          duration-300
          group-focus-within:opacity-100
        "
      />

      {/* Input */}
      <input
        ref={ref}
        className={cn(
          `
          relative
          w-full
          h-12
          px-5
          rounded-2xl
          bg-zinc-900/80
          border border-zinc-700
          text-white
          placeholder:text-zinc-400
          backdrop-blur-md

          transition-all duration-200

          focus:outline-none
          focus:border-indigo-500
          focus:ring-0

          hover:border-zinc-500
          `,
          className
        )}
        {...props}
      />
    </div>
  )
})

Input.displayName = "Input"

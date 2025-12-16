import * as React from "react"

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ name, onChange, onBlur, ...props }, ref) => {
  return (
    <input
      ref={ref}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
  )
})

Input.displayName = "Input"

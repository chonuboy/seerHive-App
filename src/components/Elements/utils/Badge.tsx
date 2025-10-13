import type React from "react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "secondary" | "rejected"
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const baseStyle = "inline-flex items-center rounded-full px-2 py-1 text-md font-medium"
  const variantStyles = {
    default: "bg-slate-400 text-white",
    success: "bg-green-500 text-white",
    secondary: "bg-yellow-400 text-gray-600",
    rejected: "bg-red-500 text-white",
  }

  return <span className={`${baseStyle} ${variantStyles[variant]} ${className}`}>{children}</span>
}


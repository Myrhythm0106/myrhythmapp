
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-teal-600/90 text-white hover:from-purple-700/95 hover:via-blue-700/95 hover:to-teal-700/95 shadow-sm shadow-emerald-300/10",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-emerald-300/20",
        premium:
          "border-transparent bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-teal-600/90 text-white hover:from-purple-700/95 hover:via-blue-700/95 hover:to-teal-700/95 shadow-md relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-amber-300/30 before:via-transparent before:to-amber-300/30 border-l border-emerald-300/20",
        healing:
          "border-transparent bg-gradient-to-r from-teal-500/90 to-blue-500/90 text-white hover:from-teal-600/95 hover:to-blue-600/95 shadow-sm shadow-emerald-300/10",
        cognitive:
          "border-transparent bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white hover:from-blue-700/95 hover:to-purple-700/95 shadow-sm shadow-emerald-300/10",
        clarity:
          "border-transparent bg-gradient-to-r from-purple-500/90 to-teal-500/90 text-white hover:from-purple-600/95 hover:to-teal-600/95 shadow-sm shadow-emerald-300/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },  
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

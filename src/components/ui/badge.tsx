
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        premium:
          "border-transparent bg-gradient-to-r from-brain-health-500/90 to-clarity-teal-500/85 text-white hover:from-brain-health-600/95 hover:to-clarity-teal-600/90 shadow-md",
        healing:
          "border-transparent bg-memory-emerald-500/90 text-white hover:bg-memory-emerald-600/95 shadow-sm",
        cognitive:
          "border-transparent bg-brain-health-500/90 text-white hover:bg-brain-health-600/95 shadow-sm",
        clarity:
          "border-transparent bg-clarity-teal-500/90 text-white hover:bg-clarity-teal-600/95 shadow-sm",
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

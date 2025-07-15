
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm hover:shadow transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-brain-health-50/30 hover:text-brain-health-700 hover:border-brain-health-300/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-brain-health-50/40 hover:text-brain-health-700",
        link: "text-brain-health-600 underline-offset-4 hover:underline hover:text-brain-health-700",
        premium: "bg-gradient-to-r from-brain-health-500/90 via-clarity-teal-500/85 to-memory-emerald-500/80 text-white hover:from-brain-health-600/95 hover:via-clarity-teal-600/90 hover:to-memory-emerald-600/85 shadow-sm hover:shadow-md transition-all duration-200",
        healing: "bg-memory-emerald-500/90 text-white hover:bg-memory-emerald-600/95 shadow-sm hover:shadow transition-all duration-200",
        cognitive: "bg-brain-health-500/90 text-white hover:bg-brain-health-600/95 shadow-sm hover:shadow transition-all duration-200",
        clarity: "bg-clarity-teal-500/90 text-white hover:bg-clarity-teal-600/95 shadow-sm hover:shadow transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

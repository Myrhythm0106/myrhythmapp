
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-brain-health-600 text-white hover:bg-brain-health-700 shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border-2 border-brain-health-600 bg-transparent text-brain-health-700 hover:bg-brain-health-50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-brain-health-50 hover:text-brain-health-700",
        link: "text-brain-health-600 underline-offset-4 hover:underline hover:text-brain-health-700",
        premium: "bg-gradient-to-r from-brain-health-600 to-brain-health-700 text-white hover:from-brain-health-700 hover:to-brain-health-800 shadow-md hover:shadow-lg",
        healing: "bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 text-white hover:from-memory-emerald-700 hover:to-brain-health-700 shadow-sm hover:shadow-md",
        cognitive: "bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 text-white hover:from-brain-health-700 hover:to-clarity-teal-700 shadow-sm hover:shadow-md",
        clarity: "bg-gradient-to-r from-clarity-teal-600 to-memory-emerald-600 text-white hover:from-clarity-teal-700 hover:to-memory-emerald-700 shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-md px-4 text-sm",
        lg: "h-16 rounded-lg px-10 text-lg",
        icon: "h-12 w-12",
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

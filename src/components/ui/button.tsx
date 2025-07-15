
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-brain-health-600 via-memory-emerald-600 to-clarity-teal-600 text-white hover:from-brain-health-700 hover:via-memory-emerald-700 hover:to-clarity-teal-700 shadow-md hover:shadow-lg transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-brain-health-200 bg-background hover:bg-brain-health-50 hover:text-brain-health-700 hover:border-brain-health-300",
        secondary:
          "bg-gradient-to-r from-brain-health-100 to-memory-emerald-100 text-brain-health-800 hover:from-brain-health-200 hover:to-memory-emerald-200",
        ghost: "hover:bg-brain-health-50 hover:text-brain-health-700",
        link: "text-brain-health-600 underline-offset-4 hover:underline hover:text-brain-health-700",
        premium: "bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 text-white hover:from-memory-emerald-600 hover:to-clarity-teal-600 shadow-lg hover:shadow-xl transition-all duration-200",
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


import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 shadow-emerald-300/10",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-gradient-to-r hover:from-purple-50/30 hover:via-blue-50/30 hover:to-teal-50/30 hover:text-purple-700 hover:border-purple-300/50 border-emerald-300/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-gradient-to-r hover:from-purple-50/40 hover:via-blue-50/40 hover:to-teal-50/40 hover:text-purple-700",
        link: "text-purple-600 underline-offset-4 hover:underline hover:text-purple-700",
        premium: "bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-amber-300/20 before:via-transparent before:to-amber-300/20 before:translate-x-[-100%] before:hover:translate-x-[100%] before:transition-transform before:duration-1000 border-l border-emerald-300/20",
        healing: "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 shadow-lg hover:shadow-teal-200/50 transition-all duration-200 shadow-emerald-300/10",
        cognitive: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-200/50 transition-all duration-200 shadow-emerald-300/10",
        clarity: "bg-gradient-to-r from-purple-500 to-teal-500 text-white hover:from-purple-600 hover:to-teal-600 shadow-lg hover:shadow-purple-200/50 transition-all duration-200 shadow-emerald-300/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-md px-8 text-lg",
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

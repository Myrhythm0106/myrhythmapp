import * as React from "react"
import { CheckCircle2, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  validationState?: 'idle' | 'valid' | 'invalid'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, validationState = 'idle', ...props }, ref) => {
    const validationClasses = {
      idle: "border-clarity-teal-300 focus:ring-clarity-teal-500/20",
      valid: "border-memory-emerald-500 focus:ring-memory-emerald-500/20 pr-10",
      invalid: "border-red-500 focus:ring-red-500/20 pr-10",
    };

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
            validationClasses[validationState],
            className
          )}
          ref={ref}
          {...props}
        />
        {validationState === 'valid' && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-memory-emerald-500" />
        )}
        {validationState === 'invalid' && (
          <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

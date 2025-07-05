
import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    collapsedWidth?: number
  }
>(({ className, children, collapsedWidth = 56, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-h-screen w-full", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    collapsible?: boolean
  }
>(({ className, collapsible = false, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      "border-r bg-background transition-all duration-300",
      className
    )}
    {...props}
  />
))
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9",
      className
    )}
    {...props}
  />
))
SidebarTrigger.displayName = "SidebarTrigger"

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
}

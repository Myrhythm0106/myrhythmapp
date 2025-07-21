
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

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 h-full", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-3 py-2", className)}
    {...props}
  />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide", className)}
    {...props}
  />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  return (
    <Comp
      ref={asChild ? undefined : ref}
      className={asChild ? undefined : cn(
        "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...(asChild ? {} : props)}
    >
      {asChild ? props.children : props.children}
    </Comp>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

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
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
}

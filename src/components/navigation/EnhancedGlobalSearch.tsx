
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Command } from "lucide-react";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { cn } from "@/lib/utils";

interface EnhancedGlobalSearchProps {
  className?: string;
  variant?: "button" | "input" | "icon";
  size?: "sm" | "md" | "lg";
}

export function EnhancedGlobalSearch({ 
  className, 
  variant = "button",
  size = "md" 
}: EnhancedGlobalSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  if (variant === "icon") {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className={cn("relative", className)}
        >
          <Search className="h-4 w-4" />
        </Button>
        <GlobalSearch />
      </>
    );
  }

  if (variant === "input") {
    return (
      <>
        <Button
          variant="outline"
          onClick={handleToggle}
          className={cn(
            "justify-start text-muted-foreground hover:text-foreground w-full max-w-sm",
            size === "sm" && "h-8 px-3 text-xs",
            size === "md" && "h-9 px-4 text-sm",
            size === "lg" && "h-10 px-4 text-base",
            className
          )}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search features...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="h-2.5 w-2.5" />
              K
            </kbd>
          </div>
        </Button>
        <GlobalSearch />
      </>
    );
  }

  return (
    <>
      <Button
        variant="default"
        onClick={handleToggle}
        className={cn(
          "gap-2",
          size === "sm" && "h-8 px-3 text-xs",
          size === "md" && "h-9 px-4 text-sm",
          size === "lg" && "h-10 px-4 text-base",
          className
        )}
      >
        <Search className="h-4 w-4" />
        Search MyRhythm
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-primary-foreground/20 px-1.5 font-mono text-[10px] font-medium">
          <Command className="h-2.5 w-2.5" />
          K
        </kbd>
      </Button>
      <GlobalSearch />
    </>
  );
}

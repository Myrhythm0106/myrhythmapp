import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Brain, Sparkles } from "lucide-react";
import { EntryDetailsDialog } from "./journal/EntryDetailsDialog";
import { cn } from "@/lib/utils";

interface FloatingGratitudeButtonProps {
  className?: string;
}

export function FloatingGratitudeButton({ className }: FloatingGratitudeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className={cn(
          "fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-xl",
          "bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500",
          "hover:from-blue-600 hover:via-purple-600 hover:to-rose-600",
          "text-white border-0 transition-all duration-300",
          "hover:scale-110 hover:shadow-2xl",
          "focus:ring-4 focus:ring-purple-200",
          "animate-pulse",
          className
        )}
        aria-label="Add Gratitude Entry"
      >
        <div className="flex flex-col items-center justify-center">
          <Plus className="h-6 w-6 mb-0.5" />
          <Brain className="h-4 w-4" />
        </div>
      </Button>

      {/* Tooltip/Label for larger screens */}
      <div className="fixed bottom-6 right-24 z-40 hidden lg:block pointer-events-none">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Brain className="h-4 w-4" />
            <span>Add Gratitude</span>
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <EntryDetailsDialog
          isNewEntry={true}
          onClose={() => setIsOpen(false)}
        />
      </Dialog>
    </>
  );
}
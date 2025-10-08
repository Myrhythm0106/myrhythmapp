// @version 0.1
// @feature Next Steps Hub - Bulk Action Bar

import React from "react";
import { motion } from "framer-motion";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionBarProps {
  selectedCount: number;
  onScheduleAll: () => void;
  onClearSelection: () => void;
  isProcessing?: boolean;
}

export function BulkActionBar({
  selectedCount,
  onScheduleAll,
  onClearSelection,
  isProcessing = false,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="bg-primary text-primary-foreground rounded-full shadow-2xl border border-primary-foreground/20 px-6 py-4 flex items-center gap-6">
        {/* Selection Count */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold">
            {selectedCount}
          </div>
          <span className="font-medium">
            {selectedCount === 1 ? "Action Selected" : "Actions Selected"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onScheduleAll}
            disabled={isProcessing}
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold h-12 px-6"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule All
          </Button>

          <Button
            onClick={onClearSelection}
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

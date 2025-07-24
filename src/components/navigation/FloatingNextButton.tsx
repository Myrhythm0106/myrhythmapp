import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ContextualNextButton } from "./ContextualNextButton";

interface FloatingNextButtonProps {
  className?: string;
}

export function FloatingNextButton({ className }: FloatingNextButtonProps) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 md:hidden ${className}`}>
      <ContextualNextButton className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white" />
    </div>
  );
}

import React from "react";
import { Sparkles } from "lucide-react";

export function AssessmentPreviewHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-6 w-6 text-yellow-500" />
        <h1 className="text-3xl font-bold">Your Rhythm Assessment Results</h1>
        <Sparkles className="h-6 w-6 text-yellow-500" />
      </div>
      <p className="text-lg text-muted-foreground">
        We've analyzed your responses and discovered valuable insights about your unique rhythm
      </p>
    </div>
  );
}

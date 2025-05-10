
import React from "react";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecommendedTab() {
  return (
    <div className="bg-muted/20 rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">
        <Brain className="h-12 w-12 text-muted" />
      </div>
      <h3 className="text-lg font-medium mb-2">Personalized Recommendations</h3>
      <p className="text-muted-foreground mb-4">
        Complete a brief cognitive assessment to receive personalized game recommendations
        tailored to your rehabilitation goals.
      </p>
      <Button variant="default">Start Assessment</Button>
    </div>
  );
}

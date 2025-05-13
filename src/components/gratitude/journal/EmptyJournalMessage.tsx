
import React from "react";
import { HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyJournalMessageProps {
  hasSearchFilters: boolean;
}

export function EmptyJournalMessage({ hasSearchFilters }: EmptyJournalMessageProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <HeartHandshake className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium">No gratitude entries found</h3>
        <p className="text-muted-foreground mt-1">
          {hasSearchFilters 
            ? "Try adjusting your search or filters" 
            : "Start recording moments of gratitude to see them here"}
        </p>
      </CardContent>
    </Card>
  );
}


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MoodSuggestionCardProps {
  suggestions: string[];
}

export function MoodSuggestionCard({ suggestions }: MoodSuggestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 list-disc pl-5">
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Leaf, Music } from "lucide-react";
import { UserType } from "@/types/user";

interface PersonalizedBreakSuggestionsProps {
  userType: UserType;
  onNext: () => void;
}

export function PersonalizedBreakSuggestions({ userType, onNext }: PersonalizedBreakSuggestionsProps) {
  const breakSuggestions = {
    "brain-injury": [
      { icon: <Coffee className="h-6 w-6 text-yellow-500" />, text: "Take a mindful coffee break" },
      { icon: <Leaf className="h-6 w-6 text-green-500" />, text: "Step outside for fresh air" },
      { icon: <Music className="h-6 w-6 text-purple-500" />, text: "Listen to calming music" },
    ],
    "stroke": [
      { icon: <Leaf className="h-6 w-6 text-green-500" />, text: "Gentle stretching exercises" },
      { icon: <Coffee className="h-6 w-6 text-yellow-500" />, text: "Hydrate with a warm drink" },
      { icon: <Music className="h-6 w-6 text-purple-500" />, text: "Practice deep breathing with music" },
    ],
    "default": [
      { icon: <Coffee className="h-6 w-6 text-yellow-500" />, text: "Take a short coffee break" },
      { icon: <Leaf className="h-6 w-6 text-green-500" />, text: "Go for a quick walk outside" },
      { icon: <Music className="h-6 w-6 text-purple-500" />, text: "Enjoy some relaxing tunes" },
    ]
  };

  const suggestions = breakSuggestions[userType] || breakSuggestions["default"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Break Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">
          Taking regular breaks can help improve focus and energy. Here are some suggestions tailored for you:
        </p>
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-center gap-3">
              {suggestion.icon}
              <span className="text-gray-900">{suggestion.text}</span>
            </li>
          ))}
        </ul>
        <div className="pt-4 border-t">
          <Button onClick={onNext} className="w-full">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

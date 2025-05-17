
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

const negativeStatements = [
  "We've already talked about this.",
  "How can you forget again?",
  "It's not that hard—just focus.",
  "You were fine yesterday.",
  "You need to pay more attention.",
  "You're not even trying.",
  "Why can't you be more organized?",
  "I shouldn't have to keep reminding you.",
  "Seriously? You don't remember?",
  "You used to be so sharp.",
  "Maybe you're just being lazy.",
  "You don't look like anything's wrong.",
  "Don't use your injury as an excuse.",
  "When are you going to get back to normal?"
];

export function NegativeStatementsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
      {negativeStatements.map((statement, index) => (
        <Alert key={index} className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-all">
          <XCircle className="h-5 w-5 text-purple-600 mr-2 inline-block" />
          <AlertDescription className="text-gray-700">
            <span className="italic">{statement}</span>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

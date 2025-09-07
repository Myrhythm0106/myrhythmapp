import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const monthlyWords = [
  "BOLD", "BRAVE", "FOCUSED", "STRONG", "CLEAR", "BRIGHT",
  "CALM", "WISE", "READY", "CAPABLE", "FIERCE", "ALIVE"
];

const iChooseStatements = [
  "I choose courage over comfort",
  "I choose progress over perfection", 
  "I choose growth over fear",
  "I choose hope over doubt",
  "I choose action over hesitation",
  "I choose strength over struggle",
  "I choose joy over worry",
  "I choose peace over chaos",
  "I choose love over fear",
  "I choose today over yesterday"
];

export function AffirmationCard() {
  // Get consistent monthly word and daily #IChoose
  const currentMonth = new Date().getMonth();
  const monthlyWord = monthlyWords[currentMonth];
  
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const todaysChoice = iChooseStatements[dayOfYear % iChooseStatements.length];

  return (
    <Card className="bg-gradient-to-br from-brand-teal-100 via-brand-emerald-50 to-brand-blue-100 border-brand-teal-200/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="text-center space-y-3">
          <div>
            <p className="text-xs text-brand-orange-600 uppercase tracking-wider font-medium">
              Word of the Month
            </p>
            <h2 className="text-4xl font-black text-brand-teal-800 tracking-tight">
              {monthlyWord}
            </h2>
          </div>
          <div className="border-t border-brand-teal-200/50 pt-3">
            <p className="text-xs text-brand-teal-600 uppercase tracking-wider font-medium">
              Today's Declaration
            </p>
            <p className="text-brand-orange-700 font-bold text-lg italic mt-1">
              #{todaysChoice.replace("I choose ", "")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-center">
          <p className="text-brand-teal-600 text-sm">
            "You've got this! Every choice builds your strength."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
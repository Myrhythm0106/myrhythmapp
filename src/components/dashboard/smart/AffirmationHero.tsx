import React from "react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

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

export function AffirmationHero() {
  const { user } = useAuth();
  
  // Get consistent monthly word and daily #IChoose
  const currentMonth = new Date().getMonth();
  const monthlyWord = monthlyWords[currentMonth];
  
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const todaysChoice = iChooseStatements[dayOfYear % iChooseStatements.length];
  
  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || "Friend";

  return (
    <section className="relative py-16 px-6 bg-gradient-to-br from-brand-teal-50 via-brand-emerald-50 to-brand-blue-50 border-b border-brand-teal-200/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          {/* Greeting */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-brand-orange-600 uppercase tracking-wider">
              {displayName}, make it courageous
            </p>
            <h1 className="text-3xl font-bold text-brand-teal-800">
              {format(new Date(), "EEEE, MMMM do")}
            </h1>
          </div>
          
          {/* Word of the Month */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-brand-orange-600 uppercase tracking-wider font-medium mb-2">
                Word of the Month
              </p>
              <h2 className="text-6xl font-black text-brand-teal-800 tracking-tight">
                {monthlyWord}
              </h2>
            </div>
            
            {/* Today's Declaration */}
            <div className="pt-4 border-t border-brand-teal-200/50 max-w-2xl mx-auto">
              <p className="text-xs text-brand-teal-600 uppercase tracking-wider font-medium mb-2">
                Today's Declaration
              </p>
              <p className="text-brand-orange-700 font-bold text-2xl italic">
                #{todaysChoice.replace("I choose ", "")}
              </p>
            </div>
          </div>
          
          {/* Inspirational Message */}
          <div className="pt-6">
            <p className="text-brand-teal-600 text-lg font-medium max-w-lg mx-auto">
              "You've got this! Every choice builds your strength."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
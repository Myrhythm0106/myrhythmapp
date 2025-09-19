import React from "react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeHierarchyDisplay } from "@/components/theme/ThemeHierarchyDisplay";
import { YearlyThemeCustomizer } from "@/components/theme/YearlyThemeCustomizer";
import { EnhancedMonthlyThemeCustomizer } from "@/components/theme/EnhancedMonthlyThemeCustomizer";

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
  
  // Get daily #IChoose based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const todaysChoice = iChooseStatements[dayOfYear % iChooseStatements.length];
  
  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || "Friend";
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

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
          
          {/* Theme Hierarchy */}
          <div className="space-y-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <ThemeHierarchyDisplay variant="full" />
                <div className="flex gap-2">
                  <YearlyThemeCustomizer currentYear={currentYear} />
                  <EnhancedMonthlyThemeCustomizer currentMonth={currentMonth} currentYear={currentYear} />
                </div>
              </div>
              
              {/* Today's Declaration */}
              <div className="pt-6 border-t border-brand-teal-200/50">
                <p className="text-xs text-brand-teal-600 uppercase tracking-wider font-medium mb-2">
                  Today, I choose to be...
                </p>
                <ThemeHierarchyDisplay variant="current" className="text-3xl" />
              </div>
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
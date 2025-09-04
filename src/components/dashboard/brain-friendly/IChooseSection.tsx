import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function IChooseSection() {
  const navigate = useNavigate();
  const [monthlyFocus, setMonthlyFocus] = useState("");
  const [iChooseStatement, setIChooseStatement] = useState("");

  useEffect(() => {
    // Load from localStorage
    const savedFocus = localStorage.getItem("myrhythm_monthly_focus");
    const savedStatement = localStorage.getItem("myrhythm_ichoose_statement");
    
    if (savedFocus) setMonthlyFocus(savedFocus);
    if (savedStatement) setIChooseStatement(savedStatement);
  }, []);

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Card className="premium-card overflow-hidden">
      <div className="relative bg-gradient-to-br from-beacon-100 via-brain-health-100 to-clarity-teal-100 p-8">
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <Sparkles className="h-16 w-16 text-brain-health-500" />
        </div>
        
        <div className="relative z-10 space-y-6">
          
          {/* Monthly Focus Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold gradient-text-brand">
              {getCurrentMonth()} Focus
            </h2>
            <p className="text-brain-health-600 font-medium">
              Your empowering intention for this month
            </p>
          </div>

          {/* Monthly Focus Display */}
          <div 
            onClick={() => navigate("/calendar?action=set-monthly-focus")}
            className="cursor-pointer group"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-brain-health-200 hover:border-brain-health-400 transition-all duration-300 hover:shadow-lg group-hover:scale-[1.02]">
              <div className="p-6 text-center space-y-3">
                {monthlyFocus ? (
                  <>
                    <div className="text-2xl font-semibold text-brain-health-800 leading-relaxed">
                      "{monthlyFocus}"
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-brain-health-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit3 className="h-4 w-4" />
                      Click to update your monthly focus
                    </div>
                  </>
                ) : (
                  <div className="text-brain-health-600 space-y-2">
                    <div className="text-lg font-medium">Set Your Monthly Focus</div>
                    <div className="text-sm">Click here to define what you want to focus on this month</div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* #IChoose Statement */}
          <div 
            onClick={() => navigate("/calendar?action=set-ichoose-statement")}
            className="cursor-pointer group"
          >
            <Card className="bg-gradient-to-br from-memory-emerald-100 to-clarity-teal-100 border-2 border-memory-emerald-200 hover:border-memory-emerald-400 transition-all duration-300 hover:shadow-lg group-hover:scale-[1.02]">
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl font-bold bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
                    #IChoose
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-memory-emerald-300 to-clarity-teal-300"></div>
                </div>
                
                {iChooseStatement ? (
                  <>
                    <div className="text-xl font-medium text-memory-emerald-800 leading-relaxed">
                      {iChooseStatement}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-memory-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit3 className="h-4 w-4" />
                      Click to update your #IChoose statement
                    </div>
                  </>
                ) : (
                  <div className="text-memory-emerald-600 space-y-2">
                    <div className="text-lg font-medium">Define Your #IChoose Statement</div>
                    <div className="text-sm">Click here to set your empowering daily choice</div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button
              onClick={() => navigate("/calendar?view=month")}
              size="sm"
              className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white hover:from-brain-health-600 hover:to-clarity-teal-600"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Plan This Month
            </Button>
            <Button
              onClick={() => navigate("/goals?focus=monthly")}
              size="sm"
              variant="outline"
              className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50"
            >
              Set Monthly Goals
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
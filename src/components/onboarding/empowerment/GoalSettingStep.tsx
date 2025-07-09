
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Target, Users, Briefcase, Activity } from "lucide-react";

interface GoalSettingStepProps {
  onGoalSelect: (goal: string) => void;
}

export function GoalSettingStep({ onGoalSelect }: GoalSettingStepProps) {
  const goals = [
    { 
      icon: Activity,
      title: "Health & Recovery", 
      description: "Optimize wellness and rehabilitation",
      value: "recovery",
      gradient: "from-emerald-600 to-emerald-800",
      accentColor: "bg-emerald-100"
    },
    { 
      icon: Users,
      title: "Family & Relationships", 
      description: "Strengthen personal connections",
      value: "family",
      gradient: "from-blue-600 to-blue-800",
      accentColor: "bg-blue-100"
    },
    { 
      icon: Briefcase,
      title: "Career & Achievement", 
      description: "Professional development and goals",
      value: "work",
      gradient: "from-indigo-600 to-indigo-800",
      accentColor: "bg-indigo-100"
    },
    { 
      icon: Target,
      title: "Personal Excellence", 
      description: "Daily wellness and self-improvement",
      value: "wellness",
      gradient: "from-purple-600 to-purple-800",
      accentColor: "bg-purple-100"
    }
  ];

  return (
    <Card className="border-0 shadow-2xl bg-white">
      <CardContent className="p-12 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-800">
            Priority Focus Area
          </h1>
          <p className="text-xl text-slate-600 max-w-lg mx-auto">
            Select your primary area of focus for personalized guidance
          </p>
        </div>
        
        <div className="space-y-4">
          {goals.map((goal) => {
            const IconComponent = goal.icon;
            return (
              <button
                key={goal.value}
                onClick={() => onGoalSelect(goal.value)}
                className="w-full p-8 bg-white rounded-3xl border-2 border-slate-200 hover:border-slate-300 hover:shadow-xl transform hover:scale-102 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${goal.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{goal.title}</h3>
                    <p className="text-lg text-slate-600">{goal.description}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-300">
                    <ArrowRight className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

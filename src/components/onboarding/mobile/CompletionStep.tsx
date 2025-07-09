
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Target, Users, Activity, Briefcase } from "lucide-react";

interface CompletionStepProps {
  onEnterApp: () => void;
}

export function CompletionStep({ onEnterApp }: CompletionStepProps) {
  return (
    <div className="text-center py-8 space-y-6">
      <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
        <CheckCircle className="h-10 w-10 text-white" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">You're All Set! 🎉</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Your empowering journey begins now. We've personalized everything just for you.
        </p>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-teal-900">Your Empowerment Hub Awaits:</h3>
        <ul className="text-sm text-teal-800 space-y-1 text-left max-w-xs mx-auto">
          <li className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Set your daily "Today I Will..." focus
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Connect with your support heroes
          </li>
          <li className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Celebrate every win, big or small
          </li>
          <li className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Track your independence journey
          </li>
        </ul>
      </div>
      
      <Button 
        onClick={onEnterApp}
        className="mt-6 w-full max-w-xs bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white shadow-lg"
        size="lg"
      >
        <ArrowRight className="h-4 w-4 mr-2" />
        Start My Journey! 🚀
      </Button>
    </div>
  );
}

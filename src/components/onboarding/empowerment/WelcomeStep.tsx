
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Target, Users, Activity, Briefcase } from "lucide-react";

interface WelcomeStepProps {
  onStart: () => void;
}

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white">
      <CardContent className="p-12 text-center space-y-8">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto">
            <Heart className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold">
            Welcome to Your Journey
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Your personalized empowerment platform is ready. We've configured 
            professional-grade tools to support your independence and wellness goals.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 space-y-4">
          <h3 className="text-2xl font-semibold">Professional Features Available:</h3>
          <div className="grid grid-cols-2 gap-4 text-lg text-slate-200">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5" />
              <span>Daily focus optimization</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <span>Professional support network</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5" />
              <span>Progress analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5" />
              <span>Achievement tracking</span>
            </div>
          </div>
        </div>
        
        <Button
          onClick={onStart}
          className="w-full max-w-md bg-white text-slate-800 hover:bg-slate-100 py-6 text-xl font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
          size="lg"
        >
          Launch Platform
          <ArrowRight className="ml-3 h-6 w-6" />
        </Button>
      </CardContent>
    </Card>
  );
}


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight } from "lucide-react";
import { UserType } from "../UserTypeStep";

interface RegistrationPromptProps {
  onAction: (action: 'register' | 'continue-guest') => void;
  userType?: UserType | null;
}

export function RegistrationPrompt({ onAction, userType }: RegistrationPromptProps) {
  const getUserTypeDisplay = () => {
    switch (userType) {
      case 'brain-injury': return 'Brain Injury Recovery';
      case 'caregiver': return 'Caregiver Support';
      case 'cognitive-optimization': return 'Cognitive Optimization';
      case 'wellness': return 'General Wellness';
      default: return 'Personal Development';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Create Your Account</h1>
        <p className="text-lg text-muted-foreground">
          Save your {getUserTypeDisplay().toLowerCase()} assessment results and continue your journey
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why create an account?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Save your assessment results</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Access your personalized {getUserTypeDisplay().toLowerCase()} plan</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Track your progress over time</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Sync across all your devices</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button onClick={() => onAction('register')} className="w-full" size="lg">
          Create Account & Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => onAction('continue-guest')} className="w-full">
          Continue as Guest
        </Button>
      </div>
    </div>
  );
}

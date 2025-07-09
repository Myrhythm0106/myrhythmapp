
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, ArrowRight, CheckCircle2, Star, Lock, Gift } from "lucide-react";

interface RegistrationPromptProps {
  onRegistrationChoice: (action: 'register' | 'continue-guest') => void;
}

export function RegistrationPrompt({ onRegistrationChoice }: RegistrationPromptProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <Gift className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Upgrade to unlock your Full Plan</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Your assessment results are ready! Complete your premium subscription to access your full personalized journey and recommendations.
        </p>
      </div>

      {/* Benefits of Premium */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <CheckCircle2 className="h-5 w-5" />
              With Premium Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span className="text-sm">Complete personalized assessment results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span className="text-sm">Detailed 8-week action plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span className="text-sm">Personalized daily recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span className="text-sm">Progress tracking dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span className="text-sm">Priority support & guidance</span>
              </div>
            </div>
            <Badge className="bg-teal-600 text-white w-full justify-center py-2">
              ✨ 7-Day Free Trial Available
            </Badge>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <Lock className="h-5 w-5" />
              Without Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                <span className="text-sm text-slate-600">Basic focus area overview only</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                <span className="text-sm text-slate-600">Limited recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                <span className="text-sm text-slate-600">No progress tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                <span className="text-sm text-slate-600">No personal action plan</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
              Missing the complete transformation experience
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <Button 
          onClick={() => onRegistrationChoice('register')}
          size="lg"
          className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-8 py-4 text-lg w-full sm:w-auto shadow-lg"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Subscribe to Premium & Get Full Results
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-teal-600">
            <Star className="h-4 w-4" />
            <span>7-day free trial</span>
          </div>
          <div className="w-px h-4 bg-slate-300"></div>
          <div className="flex items-center gap-1 text-teal-600">
            <Star className="h-4 w-4" />
            <span>Cancel anytime</span>
          </div>
          <div className="w-px h-4 bg-slate-300"></div>
          <div className="flex items-center gap-1 text-teal-600">
            <Star className="h-4 w-4" />
            <span>Full access included</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-2">
            Premium subscription required for full personalized experience
          </p>
        </div>
      </div>
    </div>
  );
}

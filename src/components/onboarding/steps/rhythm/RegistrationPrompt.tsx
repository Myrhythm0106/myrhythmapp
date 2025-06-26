
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
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <Gift className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Unlock Your Complete Rhythm Plan</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your assessment results are ready! Create your free account to access your full personalized journey and recommendations.
        </p>
      </div>

      {/* Benefits of Registration */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              With Free Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Complete personalized assessment results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Detailed 8-week action plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Personalized daily recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Progress tracking dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Save and return to your journey</span>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 w-full justify-center py-2">
              ✨ 100% Free - No Credit Card Required
            </Badge>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <Lock className="h-5 w-5" />
              Limited Preview Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-600">Basic focus area overview only</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-600">Limited recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-600">No progress tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-600">Results not saved</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              You'll miss out on your complete personalized journey
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <Button 
          onClick={() => onRegistrationChoice('register')}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg w-full sm:w-auto"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Create Free Account & Get Full Results
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <Star className="h-4 w-4" />
            <span>Takes 30 seconds</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1 text-green-600">
            <Star className="h-4 w-4" />
            <span>No spam ever</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1 text-green-600">
            <Star className="h-4 w-4" />
            <span>Cancel anytime</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button 
            onClick={() => onRegistrationChoice('continue-guest')}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
          >
            Continue with limited preview instead
          </Button>
          <p className="text-xs text-gray-500 mt-1">
            (You can register later, but your results won't be saved)
          </p>
        </div>
      </div>
    </div>
  );
}

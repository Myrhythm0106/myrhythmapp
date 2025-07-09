
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Play, Target, Brain, Heart } from "lucide-react";

export function DemoNavigation() {
  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-2 border-teal-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-teal-800 flex items-center gap-2">
          <Play className="h-4 w-4" />
          Demo Navigation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/'}
            className="text-xs"
          >
            Landing
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/onboarding'}
            className="text-xs"
          >
            Onboarding
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/dashboard'}
            className="text-xs"
          >
            Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/personal-empowerment'}
            className="text-xs"
          >
            Empowerment
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/brain-recovery'}
            className="text-xs"
          >
            Brain Recovery
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/brain-games'}
            className="text-xs"
          >
            Brain Games
          </Button>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-slate-600 mb-2">Investor Demo Flow:</p>
          <div className="flex items-center gap-1 text-xs text-teal-700">
            <Target className="h-3 w-3" />
            <span>Landing</span>
            <ArrowRight className="h-3 w-3" />
            <Brain className="h-3 w-3" />
            <span>Onboarding</span>
            <ArrowRight className="h-3 w-3" />
            <Heart className="h-3 w-3" />
            <span>Dashboard</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

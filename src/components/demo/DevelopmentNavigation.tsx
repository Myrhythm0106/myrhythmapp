
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Play, Target, Brain, Heart, Code } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function DevelopmentNavigation() {
  const [isOpen, setIsOpen] = React.useState(false);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="border-t border-gray-200 mt-4 pt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-between text-xs text-gray-600 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Code className="h-3 w-3" />
              Dev Navigation
            </div>
            <ArrowRight className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-2 mt-2">
          <div className="grid grid-cols-1 gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/'}
              className="text-xs justify-start h-8"
            >
              Landing
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/onboarding'}
              className="text-xs justify-start h-8"
            >
              Onboarding
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/dashboard'}
              className="text-xs justify-start h-8"
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/personal-empowerment'}
              className="text-xs justify-start h-8"
            >
              Empowerment
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/brain-recovery'}
              className="text-xs justify-start h-8"
            >
              Brain Recovery
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/brain-games'}
              className="text-xs justify-start h-8"
            >
              Brain Games
            </Button>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Demo Flow:</p>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Target className="h-2 w-2" />
              <span>Landing</span>
              <ArrowRight className="h-2 w-2" />
              <Brain className="h-2 w-2" />
              <span>Onboarding</span>
              <ArrowRight className="h-2 w-2" />
              <Heart className="h-2 w-2" />
              <span>Dashboard</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

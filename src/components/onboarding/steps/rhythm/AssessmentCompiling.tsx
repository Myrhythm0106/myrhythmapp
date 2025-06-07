
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";

interface AssessmentCompilingProps {
  onComplete: () => void;
}

export function AssessmentCompiling({ onComplete }: AssessmentCompilingProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds as requested

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-800">
              Compiling Your Assessment
            </h3>
            <p className="text-gray-600">
              We're analyzing your responses to create your personalized rhythm profile...
            </p>
          </div>
          
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-beacon-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-beacon-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-beacon-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

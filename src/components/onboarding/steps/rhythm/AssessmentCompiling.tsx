
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Sparkles, AlertTriangle, RefreshCw, Clock, Zap } from "lucide-react";

interface AssessmentCompilingProps {
  onComplete: () => void;
  error?: string | null;
  onManualContinue?: () => void;
  onRetry?: () => void;
}

export function AssessmentCompiling({ onComplete, error, onManualContinue, onRetry }: AssessmentCompilingProps) {
  const [timeElapsed, setTimeElapsed] = React.useState(0);

  React.useEffect(() => {
    if (error) return;
    
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    const elapsedTimer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(elapsedTimer);
    };
  }, [onComplete, error]);

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-red-800">
                🧠 MyRhythm Assessment Processing
              </h3>
              <Alert className="text-left bg-blue-50 border-blue-200">
                <AlertDescription className="text-sm text-blue-800">
                  <strong>Don't worry!</strong> Your responses are safely saved. We're experiencing high demand for personalized cognitive assessments.
                </AlertDescription>
              </Alert>
              
              <Alert className="text-left">
                <AlertDescription className="text-sm text-gray-600">
                  Technical details: {error}
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={onManualContinue} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <Zap className="h-4 w-4" />
                Get My Results Now
              </Button>
              {onRetry && (
                <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Processing Again
                </Button>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              🛡️ <strong>MyRhythm Promise:</strong> Your cognitive wellness data is secure and your personalized insights are ready to unlock your brain's potential.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              🧠 Analyzing Your Cognitive Profile
            </h3>
            <p className="text-gray-600">
              MyRhythm is creating your personalized brain wellness roadmap using advanced cognitive assessment algorithms...
            </p>
            {timeElapsed > 3 && (
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                <Clock className="h-4 w-4" />
                <span>Deep analysis in progress... ({timeElapsed}s)</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-beacon-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-beacon-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-beacon-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {timeElapsed > 5 && onManualContinue && (
            <div className="pt-4 border-t">
              <Alert className="mb-3 bg-green-50 border-green-200">
                <AlertDescription className="text-sm text-green-800">
                  <strong>Ready for Results?</strong> Your assessment is complete and we can show your personalized insights now.
                </AlertDescription>
              </Alert>
              <Button variant="default" size="sm" onClick={onManualContinue} className="bg-green-600 hover:bg-green-700">
                <Zap className="h-4 w-4 mr-2" />
                View My MyRhythm Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Sparkles, AlertTriangle, RefreshCw } from "lucide-react";

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
                Assessment Processing Error
              </h3>
              <Alert className="text-left">
                <AlertDescription className="text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="flex flex-col gap-3">
              {onRetry && (
                <Button onClick={onRetry} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
              {onManualContinue && (
                <Button variant="outline" onClick={onManualContinue}>
                  Continue with Basic Results
                </Button>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Don't worry - your responses have been saved and we can still provide you with valuable insights.
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
              Compiling Your Assessment
            </h3>
            <p className="text-gray-600">
              We're analyzing your responses to create your personalized rhythm profile...
            </p>
            {timeElapsed > 5 && (
              <p className="text-sm text-muted-foreground">
                Processing complex analysis... ({timeElapsed}s)
              </p>
            )}
          </div>
          
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-beacon-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-beacon-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-beacon-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {timeElapsed > 8 && onManualContinue && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Taking longer than expected?
              </p>
              <Button variant="outline" size="sm" onClick={onManualContinue}>
                Continue with Basic Analysis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

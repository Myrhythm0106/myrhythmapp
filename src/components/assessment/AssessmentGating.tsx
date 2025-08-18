import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentGatingProps {
  isPreview: boolean;
  onUpgrade: () => void;
}

export function AssessmentGating({ isPreview, onUpgrade }: AssessmentGatingProps) {
  const navigate = useNavigate();

  if (!isPreview) {
    return null; // No gating for paid users
  }

  return (
    <Card className="border-2 border-dashed border-brain-health-300 bg-gradient-to-br from-brain-health-50/50 to-clarity-teal-50/30">
      <CardHeader className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-brain-health-900">
          Unlock Your Full A.C.T.S. Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-brain-health-700">
          You've seen a preview of your results. To access your complete personalized A.C.T.S. Summary with detailed insights and action plans, upgrade to a MyRhythm plan.
        </p>
        
        <div className="bg-white/60 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-brain-health-800 flex items-center justify-center gap-2">
            <Crown className="h-4 w-4 text-sunrise-amber-500" />
            Full Version Includes:
          </h4>
          <ul className="text-sm text-brain-health-700 space-y-1">
            <li>• Detailed personalized insights & recommendations</li>
            <li>• Complete A.C.T.S. framework breakdown</li>
            <li>• Custom action plans for your journey</li>
            <li>• Calendar integration & rhythm optimization</li>
            <li>• Progress tracking and memory tools</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onUpgrade}
            className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Unlock Full Results
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/mvp')}
          >
            Back to MyRhythm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
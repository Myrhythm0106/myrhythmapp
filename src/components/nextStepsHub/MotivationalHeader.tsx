import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Target, 
  Trophy, 
  Heart,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';

interface MotivationalHeaderProps {
  actions: NextStepsItem[];
  recommendedAction: NextStepsItem | null;
}

export function MotivationalHeader({ actions, recommendedAction }: MotivationalHeaderProps) {
  const getWordOfTheMonth = () => {
    const monthlyWords = [
      'FRESH', 'BOLD', 'FLOURISH', 'BRIGHT', 'BLOOM', 'RADIANT',
      'VIBRANT', 'FIERCE', 'GRATEFUL', 'POWERFUL', 'RESILIENT', 'TRIUMPHANT'
    ];
    return monthlyWords[new Date().getMonth()];
  };

  const completedActions = actions.filter(a => ['done', 'completed', 'confirmed'].includes(a.status));
  const activeActions = actions.filter(a => !['done', 'completed', 'confirmed'].includes(a.status));
  const completionRate = actions.length > 0 ? Math.round((completedActions.length / actions.length) * 100) : 0;

  const getMotivationalMessage = () => {
    if (completionRate >= 80) return "You're absolutely crushing it! 🔥";
    if (completionRate >= 60) return "Building incredible momentum! ⚡";
    if (completionRate >= 40) return "Making steady, empowering progress! 🌟";
    if (completionRate >= 20) return "Every step forward is a victory! 💪";
    return "Your journey to empowerment starts now! 🚀";
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 border-purple-200 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEyOCwgMTI4LCAxMjgsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            {/* Word of the Month */}
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Word of the Month
              </Badge>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {getWordOfTheMonth()}
              </h1>
            </div>

            {/* Main Title */}
            <div>
              <CardTitle className="text-3xl font-bold text-purple-800 flex items-center gap-3">
                <Target className="h-8 w-8 text-purple-600" />
                Your Next Steps Hub
              </CardTitle>
              <p className="text-purple-700 text-lg mt-2">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {completedActions.length}
              </div>
              <p className="text-sm text-green-700 font-medium">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {activeActions.length}
              </div>
              <p className="text-sm text-blue-700 font-medium">In Progress</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {completionRate}%
              </div>
              <p className="text-sm text-purple-700 font-medium">Success Rate</p>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Recommended Action */}
      {recommendedAction && (
        <CardContent className="pt-0 relative">
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-yellow-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      🧠 Smart Recommendation
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {recommendedAction.action_text}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Perfect match for your current energy and priorities
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                  Take Action
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      )}

      {/* Celebration for milestones */}
      {completedActions.length > 0 && completedActions.length % 5 === 0 && (
        <div className="absolute top-4 right-4 animate-bounce">
          <Trophy className="h-8 w-8 text-yellow-500" />
        </div>
      )}
    </Card>
  );
}
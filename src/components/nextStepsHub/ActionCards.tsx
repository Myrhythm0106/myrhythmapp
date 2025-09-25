import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  Users, 
  Calendar,
  CheckCircle,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { toast } from 'sonner';

interface ActionCardsProps {
  actions: NextStepsItem[];
  recommendedAction: NextStepsItem | null;
  onActionUpdate: () => void;
}

export function ActionCards({ actions, recommendedAction, onActionUpdate }: ActionCardsProps) {
  const handleStartAction = (action: NextStepsItem) => {
    // Celebration messages for starting actions
    const encouragingMessages = [
      "🚀 You've got this! Every step forward is progress!",
      "⭐ Amazing choice! Your future self will thank you!",
      "💪 Building momentum one action at a time!",
      "🎯 Perfect! You're making things happen!",
      "✨ This is how empowerment looks!"
    ];
    
    const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    toast.success(message, {
      description: "Action started - you're on your way to success!"
    });
  };

  const handleCompleteAction = (action: NextStepsItem) => {
    // Extra celebratory messages for completion
    const celebrationMessages = [
      "🎉 INCREDIBLE! You just crushed that action!",
      "🌟 VICTORY! Your brain is building stronger neural pathways!",
      "🏆 CHAMPION! Another commitment honored!",
      "💎 BRILLIANT! You're becoming unstoppable!",
      "🔥 PHENOMENAL! Keep this momentum going!"
    ];
    
    const message = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
    toast.success(message, {
      description: "Completed actions build trust with yourself and others!"
    });
    
    onActionUpdate();
  };

  const urgentActions = actions.filter(a => 
    !['done', 'completed', 'confirmed'].includes(a.status) &&
    (a.due_context?.includes('today') || a.due_context?.includes('asap'))
  );

  const todayActions = actions.filter(a => 
    !['done', 'completed', 'confirmed'].includes(a.status) &&
    a.scheduled_date === new Date().toISOString().split('T')[0]
  );

  const recentlyCompleted = actions.filter(a => 
    ['done', 'completed', 'confirmed'].includes(a.status)
  ).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Urgent Actions */}
      {urgentActions.length > 0 && (
        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Clock className="h-5 w-5" />
              🚨 Urgent Actions
              <Badge className="bg-red-100 text-red-800">
                {urgentActions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentActions.slice(0, 2).map((action, index) => (
              <Card 
                key={action.id || index}
                className="p-3 bg-white/70 border border-red-200 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900">
                    {action.action_text}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <Clock className="h-3 w-3" />
                      {action.due_context}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleStartAction(action)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Today's Scheduled Actions */}
      {todayActions.length > 0 && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Calendar className="h-5 w-5" />
              📅 Today's Schedule
              <Badge className="bg-blue-100 text-blue-800">
                {todayActions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayActions.slice(0, 2).map((action, index) => (
              <Card 
                key={action.id || index}
                className="p-3 bg-white/70 border border-blue-200 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900">
                    {action.action_text}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Calendar className="h-3 w-3" />
                      {action.scheduled_time || 'No time set'}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleStartAction(action)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recently Completed (Celebration) */}
      {recentlyCompleted.length > 0 && (
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Star className="h-5 w-5" />
              🎉 Recent Victories
              <Badge className="bg-green-100 text-green-800">
                {recentlyCompleted.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentlyCompleted.map((action, index) => (
              <Card 
                key={action.id || index}
                className="p-3 bg-white/70 border border-green-200"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-sm text-gray-900 line-through opacity-75">
                      {action.action_text}
                    </h4>
                  </div>
                  <p className="text-xs text-green-700 font-medium">
                    ✨ Completed! Building trust and momentum!
                  </p>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Brain-Friendly Quick Actions */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Zap className="h-5 w-5" />
            🧠 Brain Boosters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => toast.success("Great choice! 2 minutes can make a big difference! 🧠")}
            >
              <Target className="h-4 w-4 mr-2" />
              2-Minute Brain Break
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => toast.success("Hydration powers your brain! Great thinking! 💧")}
            >
              <Zap className="h-4 w-4 mr-2" />
              Hydration Check
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-left justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => toast.success("Movement energizes your mind! Fantastic choice! 🏃‍♀️")}
            >
              <Play className="h-4 w-4 mr-2" />
              5-Minute Movement
            </Button>
          </div>
          <p className="text-xs text-purple-600 mt-3 text-center">
            Small actions compound into extraordinary results! 🌟
          </p>
        </CardContent>
      </Card>

      {/* Support Circle Actions */}
      {actions.some(a => a.assigned_watchers && a.assigned_watchers.length > 0) && (
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Users className="h-5 w-5" />
              👥 Support Circle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {actions
              .filter(a => a.assigned_watchers && a.assigned_watchers.length > 0)
              .slice(0, 2)
              .map((action, index) => (
                <Card 
                  key={action.id || index}
                  className="p-3 bg-white/70 border border-orange-200 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-900">
                      {action.action_text}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <Users className="h-3 w-3" />
                        {action.assigned_watchers?.length} watching
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => handleStartAction(action)}
                      >
                        Show Progress
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
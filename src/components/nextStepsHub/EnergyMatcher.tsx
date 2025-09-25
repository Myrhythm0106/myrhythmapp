import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Zap, 
  Battery, 
  BatteryLow,
  Target,
  Clock,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';

interface EnergyMatcherProps {
  actions: NextStepsItem[];
  currentEnergyLevel: 'high' | 'medium' | 'low';
  onEnergyLevelChange: (level: 'high' | 'medium' | 'low') => void;
  onActionUpdate: () => void;
}

export function EnergyMatcher({ 
  actions, 
  currentEnergyLevel, 
  onEnergyLevelChange, 
  onActionUpdate 
}: EnergyMatcherProps) {
  
  const getEnergyMatch = (action: NextStepsItem) => {
    const actionText = action.action_text?.toLowerCase() || '';
    
    // High energy tasks: calls, meetings, presentations, creative work
    if (actionText.includes('call') || actionText.includes('meeting') || 
        actionText.includes('present') || actionText.includes('brainstorm') ||
        actionText.includes('create') || actionText.includes('design')) {
      return 'high';
    }
    
    // Medium energy tasks: emails, planning, writing
    if (actionText.includes('email') || actionText.includes('write') || 
        actionText.includes('plan') || actionText.includes('research') ||
        actionText.includes('review') || actionText.includes('organize')) {
      return 'medium';
    }
    
    // Low energy tasks: simple admin, filing, routine tasks
    return 'low';
  };

  const getMatchedActions = (energyLevel: 'high' | 'medium' | 'low') => {
    return actions.filter(action => 
      !['done', 'completed', 'confirmed'].includes(action.status) &&
      getEnergyMatch(action) === energyLevel
    );
  };

  const getEnergyAdvice = (energyLevel: 'high' | 'medium' | 'low') => {
    switch (energyLevel) {
      case 'high':
        return {
          icon: <Zap className="h-5 w-5 text-orange-500" />,
          title: "Peak Performance Mode",
          description: "Perfect time for challenging tasks, important calls, and creative work.",
          color: "from-orange-50 to-red-50 border-orange-200",
          textColor: "text-orange-800"
        };
      case 'medium':
        return {
          icon: <Battery className="h-5 w-5 text-blue-500" />,
          title: "Steady Focus Mode",
          description: "Great for planning, writing, and routine tasks that need attention.",
          color: "from-blue-50 to-indigo-50 border-blue-200",
          textColor: "text-blue-800"
        };
      case 'low':
        return {
          icon: <BatteryLow className="h-5 w-5 text-green-500" />,
          title: "Gentle Productivity Mode",
          description: "Time for simple admin tasks, organizing, and preparing for tomorrow.",
          color: "from-green-50 to-emerald-50 border-green-200",
          textColor: "text-green-800"
        };
    }
  };

  const getTimeOfDayIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return <Sun className="h-4 w-4 text-yellow-500" />;
    if (hour >= 12 && hour < 18) return <Coffee className="h-4 w-4 text-orange-500" />;
    return <Moon className="h-4 w-4 text-blue-500" />;
  };

  const getCurrentEnergyAdvice = getEnergyAdvice(currentEnergyLevel);
  const matchedActions = getMatchedActions(currentEnergyLevel);

  return (
    <div className="space-y-6">
      {/* Energy Level Selector */}
      <Card className={`bg-gradient-to-r ${getCurrentEnergyAdvice.color}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${getCurrentEnergyAdvice.textColor}`}>
              {getCurrentEnergyAdvice.icon}
              How's Your Energy Right Now?
              {getTimeOfDayIcon()}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button
                variant={currentEnergyLevel === 'high' ? 'default' : 'outline'}
                onClick={() => onEnergyLevelChange('high')}
                className="flex-1"
              >
                <Zap className="h-4 w-4 mr-2" />
                High Energy
              </Button>
              <Button
                variant={currentEnergyLevel === 'medium' ? 'default' : 'outline'}
                onClick={() => onEnergyLevelChange('medium')}
                className="flex-1"
              >
                <Battery className="h-4 w-4 mr-2" />
                Medium Energy
              </Button>
              <Button
                variant={currentEnergyLevel === 'low' ? 'default' : 'outline'}
                onClick={() => onEnergyLevelChange('low')}
                className="flex-1"
              >
                <BatteryLow className="h-4 w-4 mr-2" />
                Low Energy
              </Button>
            </div>
            
            <div className={`p-4 rounded-lg bg-white/60 border border-white/40`}>
              <h4 className={`font-semibold ${getCurrentEnergyAdvice.textColor} mb-2`}>
                {getCurrentEnergyAdvice.title}
              </h4>
              <p className={`text-sm ${getCurrentEnergyAdvice.textColor}`}>
                {getCurrentEnergyAdvice.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matched Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Perfect Actions for Your Current Energy
            <Badge className="bg-purple-100 text-purple-800">
              {matchedActions.length} matches
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {matchedActions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-4">
                {currentEnergyLevel === 'high' && '⚡'}
                {currentEnergyLevel === 'medium' && '🎯'}
                {currentEnergyLevel === 'low' && '🌱'}
              </div>
              <p className="text-lg font-medium mb-2">No perfect matches right now</p>
              <p className="text-sm">
                {currentEnergyLevel === 'high' && 'Try checking your medium or low energy tasks, or take a break to recharge!'}
                {currentEnergyLevel === 'medium' && 'Consider tackling some high energy tasks or organizing low energy ones!'}
                {currentEnergyLevel === 'low' && 'Perfect time to rest or do some gentle organizing. Your high energy tasks can wait!'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {matchedActions.map((action, index) => (
                  <Card 
                    key={action.id || index}
                    className="p-4 border-l-4 border-l-green-400 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            Perfect Match ✨
                          </Badge>
                          {getEnergyAdvice(getEnergyMatch(action)).icon}
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {action.action_text}
                        </h4>
                        
                        {action.due_context && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                            <Clock className="h-3 w-3" />
                            {action.due_context}
                          </div>
                        )}

                        <div className="bg-green-100 border border-green-200 rounded-md p-2 text-xs text-green-800">
                          🧠 <strong>Why this works now:</strong> This task matches your current energy level perfectly. 
                          Your brain is primed for this type of work!
                        </div>
                      </div>
                      
                      <Button className="bg-green-600 hover:bg-green-700 text-white ml-4">
                        Start Now
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Energy Tips */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Coffee className="h-5 w-5" />
            Brain-Friendly Energy Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/60 rounded-lg border border-white/40">
              <Zap className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <h4 className="font-semibold text-orange-800 mb-1">High Energy</h4>
              <p className="text-xs text-orange-700">Morning hours, after exercise, or when feeling inspired</p>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg border border-white/40">
              <Battery className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <h4 className="font-semibold text-blue-800 mb-1">Medium Energy</h4>
              <p className="text-xs text-blue-700">Mid-morning, early afternoon, or after a good meal</p>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg border border-white/40">
              <BatteryLow className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <h4 className="font-semibold text-green-800 mb-1">Low Energy</h4>
              <p className="text-xs text-green-700">End of day, post-lunch dip, or when feeling tired</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
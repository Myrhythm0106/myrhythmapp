import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  Calendar, 
  Users, 
  Target,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlowSuggestion {
  id: string;
  title: string;
  description: string;
  nextAction: {
    label: string;
    route: string;
    icon: React.ComponentType<any>;
  };
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface EcosystemFlowWidgetProps {
  className?: string;
  compact?: boolean;
}

export function EcosystemFlowWidget({ className = "", compact = false }: EcosystemFlowWidgetProps) {
  const navigate = useNavigate();
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  // Smart flow suggestions based on user context
  const getFlowSuggestions = (): FlowSuggestion[] => {
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    
    // Morning suggestions (6-12)
    if (hour >= 6 && hour < 12) {
      return [
        {
          id: 'morning-capture',
          title: 'Morning Intention Setting',
          description: 'Capture your priorities and commitments for the day',
          nextAction: {
            label: 'Quick Record',
            route: '/memory-bridge?tab=recording',
            icon: Brain
          },
          reason: 'Best time for clear thinking and goal setting',
          priority: 'high'
        },
        {
          id: 'daily-review',
          title: 'Daily Calendar Review',
          description: 'Review and optimize your schedule for maximum effectiveness',
          nextAction: {
            label: 'View Calendar',
            route: '/calendar',
            icon: Calendar
          },
          reason: 'Plan your day with intention',
          priority: 'medium'
        }
      ];
    }
    
    // Afternoon suggestions (12-18)
    if (hour >= 12 && hour < 18) {
      return [
        {
          id: 'midday-check',
          title: 'Progress Check-in',
          description: 'Review completed actions and adjust priorities',
          nextAction: {
            label: 'Next Steps Hub',
            route: '/next-steps',
            icon: Target
          },
          reason: 'Maintain momentum and celebrate progress',
          priority: 'high'
        },
        {
          id: 'support-update',
          title: 'Support Circle Update',
          description: 'Share progress and get encouragement from your circle',
          nextAction: {
            label: 'Update Circle',
            route: '/support-circle',
            icon: Users
          },
          reason: 'Stay connected and accountable',
          priority: 'medium'
        }
      ];
    }
    
    // Evening suggestions (18-22)
    if (hour >= 18 && hour < 22) {
      return [
        {
          id: 'evening-reflection',
          title: 'Daily Reflection',
          description: 'Capture insights and learnings from today',
          nextAction: {
            label: 'Record Insights',
            route: '/memory-bridge?tab=recording',
            icon: Brain
          },
          reason: 'End the day with wisdom and gratitude',
          priority: 'high'
        },
        {
          id: 'tomorrow-prep',
          title: 'Tomorrow\'s Setup',
          description: 'Schedule extracted actions for optimal timing',
          nextAction: {
            label: 'Smart Schedule',
            route: '/next-steps',
            icon: Calendar
          },
          reason: 'Set yourself up for tomorrow\'s success',
          priority: 'medium'
        }
      ];
    }
    
    // Weekend suggestions
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return [
        {
          id: 'weekly-planning',
          title: 'Weekly Planning Session',
          description: 'Set intentions and priorities for the upcoming week',
          nextAction: {
            label: 'Annual Compass',
            route: '/calendar?view=year',
            icon: Calendar
          },
          reason: 'Align weekly actions with yearly goals',
          priority: 'high'
        }
      ];
    }
    
    // Default suggestions
    return [
      {
        id: 'quick-capture',
        title: 'Capture a Commitment',
        description: 'Turn your thoughts into actionable commitments',
        nextAction: {
          label: 'Quick Record',
          route: '/memory-bridge?tab=recording',
          icon: Brain
        },
        reason: 'Transform ideas into progress',
        priority: 'high'
      }
    ];
  };

  const suggestions = getFlowSuggestions();
  const currentSuggestion = suggestions[currentSuggestionIndex];

  const handleNext = () => {
    setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length);
  };

  const handleActionClick = () => {
    navigate(currentSuggestion.nextAction.route);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (compact) {
    return (
      <Card className={`border-l-4 border-l-blue-500 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <currentSuggestion.nextAction.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{currentSuggestion.title}</h4>
                <p className="text-xs text-gray-600">{currentSuggestion.reason}</p>
              </div>
            </div>
            <Button size="sm" onClick={handleActionClick}>
              <currentSuggestion.nextAction.icon className="w-4 h-4 mr-1" />
              {currentSuggestion.nextAction.label}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold">Smart Flow Suggestion</h3>
          </div>
          {suggestions.length > 1 && (
            <Button variant="ghost" size="sm" onClick={handleNext}>
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSuggestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{currentSuggestion.title}</h4>
                  <Badge className={`text-xs ${getPriorityColor(currentSuggestion.priority)}`}>
                    {currentSuggestion.priority} priority
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm">{currentSuggestion.description}</p>
                <p className="text-xs text-blue-600 italic">{currentSuggestion.reason}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button 
                onClick={handleActionClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <currentSuggestion.nextAction.icon className="w-4 h-4 mr-2" />
                {currentSuggestion.nextAction.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Perfect timing</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress indicator */}
        {suggestions.length > 1 && (
          <div className="flex justify-center mt-4 gap-1">
            {suggestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSuggestionIndex ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
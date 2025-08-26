import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Target, Zap, MessageCircle, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MotivationalMessage {
  id: string;
  message: string;
  type: 'encouragement' | 'reminder' | 'celebration' | 'gentle_nudge';
  icon: React.ReactNode;
  color: string;
}

interface MotivationalRemindersProps {
  actionText: string;
  dueDate?: string;
  priority: number;
  watcherNames: string[];
  onComplete?: () => void;
}

export function MotivationalReminders({
  actionText,
  dueDate,
  priority,
  watcherNames,
  onComplete
}: MotivationalRemindersProps) {
  const [currentMessage, setCurrentMessage] = useState<MotivationalMessage | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const messages: MotivationalMessage[] = [
    {
      id: 'encouragement-1',
      message: `You've got this! ${actionText} is within your reach. Take the first small step today.`,
      type: 'encouragement',
      icon: <Zap className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'accountability-1',
      message: `${watcherNames.slice(0, 2).join(' and ')} ${watcherNames.length > 2 ? `and ${watcherNames.length - 2} others` : ''} are rooting for you on this commitment!`,
      type: 'encouragement',
      icon: <Heart className="h-4 w-4" />,
      color: 'bg-pink-100 text-pink-800 border-pink-200'
    },
    {
      id: 'progress-1',
      message: `Every step forward matters. Even 5 minutes on "${actionText}" is progress worth celebrating.`,
      type: 'gentle_nudge',
      icon: <Target className="h-4 w-4" />,
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: 'reminder-1',
      message: `Friendly reminder: "${actionText}" ${dueDate ? `is scheduled for ${dueDate}` : 'is waiting for you'}.`,
      type: 'reminder',
      icon: <Calendar className="h-4 w-4" />,
      color: 'bg-orange-100 text-orange-800 border-orange-200'
    }
  ];

  useEffect(() => {
    // Rotate messages every 8 seconds
    const interval = setInterval(() => {
      if (!isCompleted) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setCurrentMessage(randomMessage);
      }
    }, 8000);

    // Set initial message
    setCurrentMessage(messages[0]);

    return () => clearInterval(interval);
  }, [isCompleted]);

  const handleMarkComplete = () => {
    setIsCompleted(true);
    setCurrentMessage({
      id: 'celebration',
      message: `🎉 Amazing work! You've completed "${actionText}". Your commitment is inspiring!`,
      type: 'celebration',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'bg-green-100 text-green-800 border-green-200'
    });
    
    toast.success('Action completed! Your watchers will be notified.');
    
    if (onComplete) {
      setTimeout(onComplete, 2000);
    }
  };

  const handleSendEncouragement = () => {
    toast.success(`Encouragement sent to ${watcherNames.length} watcher${watcherNames.length !== 1 ? 's' : ''}!`);
  };

  if (!currentMessage) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Current Message */}
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${currentMessage.color}`}>
              {currentMessage.icon}
            </div>
            <div className="flex-1">
              <Badge className={`mb-2 ${currentMessage.color}`}>
                {currentMessage.type.replace('_', ' ').toUpperCase()}
              </Badge>
              <p className="text-sm leading-relaxed">
                {currentMessage.message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!isCompleted && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Button
                size="sm"
                onClick={handleMarkComplete}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                Mark Complete
              </Button>
              
              {watcherNames.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSendEncouragement}
                  className="flex items-center gap-1"
                >
                  <MessageCircle className="h-3 w-3" />
                  Ask for Support
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                More Motivation
              </Button>
            </div>
          )}

          {/* Watchers Info */}
          {watcherNames.length > 0 && (
            <div className="text-xs text-muted-foreground pt-2 border-t">
              👥 Accountability partners: {watcherNames.join(', ')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
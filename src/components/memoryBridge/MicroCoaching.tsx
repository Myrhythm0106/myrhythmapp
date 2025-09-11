import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  ArrowRight, 
  CheckCircle, 
  X,
  Mic,
  Target,
  Clock
} from 'lucide-react';

interface MicroCoachingProps {
  stage: 'pre-recording' | 'during-recording' | 'post-extraction';
  actionsCount?: number;
  recordingDuration?: number;
  onDismiss?: () => void;
}

export function MicroCoaching({ 
  stage, 
  actionsCount = 0, 
  recordingDuration = 0,
  onDismiss 
}: MicroCoachingProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCoachingContent = () => {
    switch (stage) {
      case 'pre-recording':
        return {
          icon: Mic,
          title: "Ready to Record?",
          message: "Speak naturally about your commitments. The AI works best when you use phrases like 'I will...' or 'I'll make sure to...'",
          tips: [
            "Mention specific dates and times",
            "Speak clearly and avoid background noise", 
            "Include who you're committing to",
            "State the action and desired outcome"
          ],
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200"
        };

      case 'during-recording':
        return {
          icon: Target,
          title: "Great! Keep Going...",
          message: recordingDuration > 30 
            ? "Perfect timing! You're giving the AI plenty to work with." 
            : "Try to record for at least 30 seconds for better results.",
          tips: [
            "The AI is listening for commitment phrases",
            "Don't worry about perfect grammar",
            "Natural conversation works best",
            "Include context about why it matters"
          ],
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200"
        };

      case 'post-extraction':
        return {
          icon: CheckCircle,
          title: actionsCount > 0 ? "Actions Extracted!" : "No Actions Found",
          message: actionsCount > 0 
            ? `Found ${actionsCount} actionable commitment${actionsCount > 1 ? 's' : ''}. Review and schedule them below.`
            : "Try recording again with more specific commitment language like 'I will...' or 'I'll do...'",
          tips: actionsCount > 0 ? [
            "Review each action for accuracy",
            "Add dates and times if missing",
            "Edit any details as needed",
            "Schedule them to your calendar"
          ] : [
            "Use phrases like 'I will...' or 'I commit to...'",
            "Be specific about what you'll do",
            "Mention when you'll do it",
            "Include who benefits from the action"
          ],
          color: actionsCount > 0 ? "text-green-600" : "text-orange-600",
          bg: actionsCount > 0 ? "bg-green-50" : "bg-orange-50",
          border: actionsCount > 0 ? "border-green-200" : "border-orange-200"
        };

      default:
        return null;
    }
  };

  const content = getCoachingContent();
  if (!content) return null;

  const { icon: Icon, title, message, tips, color, bg, border } = content;

  return (
    <Card className={`${border} ${bg}`}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`mt-1 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className={`font-semibold ${color}`}>{title}</h4>
                <Badge className={`${bg} ${color} border-current`}>
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Tip
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {message}
              </p>
              
              {!isExpanded ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className={`${color} hover:${bg} p-0 h-auto`}
                >
                  Show tips <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              ) : (
                <div className="space-y-2">
                  <ul className="text-xs space-y-1">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className={color}>•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className={`${color} hover:${bg} p-0 h-auto mt-2`}
                  >
                    Hide tips
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {onDismiss && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onDismiss}
              className="p-1 h-auto text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
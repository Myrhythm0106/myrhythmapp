import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Clock, MapPin, Target, Users, Brain, 
  ChevronDown, ChevronUp, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ContextualReminderCardProps {
  title: string;
  time: string;
  date?: string;
  category?: string | null;
  motivation?: string | null;
  location?: string | null;
  whoBenefits?: string | null;
  benefitMessage?: string | null;
  currentStreak?: number;
  escalationLevel?: number;
  onComplete: () => void;
  onSnooze: () => void;
  onNeedHelp: () => void;
}

export function ContextualReminderCard({
  title,
  time,
  date,
  category,
  motivation,
  location,
  whoBenefits,
  benefitMessage,
  currentStreak = 0,
  escalationLevel = 0,
  onComplete,
  onSnooze,
  onNeedHelp
}: ContextualReminderCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Get urgency styling based on escalation
  const getUrgencyStyles = () => {
    switch (escalationLevel) {
      case 0: return 'border-primary/20 bg-card';
      case 1: return 'border-yellow-500/30 bg-yellow-500/5';
      case 2: return 'border-orange-500/40 bg-orange-500/10';
      case 3: return 'border-destructive/50 bg-destructive/10 animate-pulse';
      default: return 'border-primary/20 bg-card';
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'medication': return '💊';
      case 'appointment': return '📅';
      case 'exercise': return '🏃';
      case 'social': return '👥';
      case 'self-care': return '🧘';
      default: return '✓';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300 border-2",
        getUrgencyStyles()
      )}>
        <CardContent className="p-0">
          {/* Header with streak badge */}
          {currentStreak > 0 && (
            <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-transparent flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {currentStreak} day streak! 🔥
              </span>
            </div>
          )}

          {/* Main content */}
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                {getCategoryIcon()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground leading-tight">
                  {title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {time}
                  </Badge>
                  {date && (
                    <Badge variant="outline" className="text-xs">
                      {date}
                    </Badge>
                  )}
                  {location && (
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {location}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Motivation - always visible */}
            {motivation && (
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm font-medium text-foreground flex items-start gap-2">
                  <Target className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="italic">"{motivation}"</span>
                </p>
              </div>
            )}

            {/* Expandable details */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-muted-foreground"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Less details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Why this matters
                </>
              )}
            </Button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-3"
              >
                {whoBenefits && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Who benefits:</strong> {whoBenefits}</span>
                  </div>
                )}
                
                {benefitMessage && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Brain className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Brain benefit:</strong> {benefitMessage}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={onComplete}
                className="flex-1 font-semibold"
                size="lg"
              >
                ✓ Done
              </Button>
              <Button 
                variant="secondary"
                onClick={onSnooze}
                className="flex-1"
                size="lg"
              >
                ⏰ Snooze
              </Button>
              <Button 
                variant="outline"
                onClick={onNeedHelp}
                size="lg"
              >
                🆘
              </Button>
            </div>

            {/* Escalation warning */}
            {escalationLevel >= 2 && (
              <p className="text-xs text-center text-muted-foreground mt-3">
                {escalationLevel === 2 
                  ? "⚠️ This is getting urgent - can we help?"
                  : "🚨 Your support circle will be notified if this isn't addressed soon"
                }
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

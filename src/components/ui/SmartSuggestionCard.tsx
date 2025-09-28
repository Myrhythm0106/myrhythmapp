import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Sparkles, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConflictIndicator, ConflictLevel } from '@/components/ui/ConflictIndicator';
import { DisclosureCard } from '@/components/ui/DisclosureCard';
import { cn } from '@/lib/utils';

interface SmartSuggestion {
  date: string;
  time: string;
  confidence: number;
  reason: string;
  conflictLevel: ConflictLevel;
  conflictDetails?: string[];
  bufferTime?: number;
  energyMatch?: string;
}

interface SmartSuggestionCardProps {
  suggestion: SmartSuggestion;
  alternatives?: SmartSuggestion[];
  onSchedule?: (suggestion: SmartSuggestion) => void;
  onSelectAlternative?: (suggestion: SmartSuggestion) => void;
  className?: string;
  showAlternatives?: boolean;
  isScheduling?: boolean;
}

export function SmartSuggestionCard({
  suggestion,
  alternatives = [],
  onSchedule,
  onSelectAlternative,
  className,
  showAlternatives = true,
  isScheduling = false
}: SmartSuggestionCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getConfidenceStars = (confidence: number) => {
    const stars = Math.round(confidence / 20); // Convert 0-100 to 0-5 stars
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={cn(
          "w-3 h-3",
          i < stars ? "text-yellow-400 fill-current" : "text-gray-300"
        )} 
      />
    ));
  };

  const previewContent = (
    <div className="space-y-4">
      {/* Main Suggestion */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {formatDate(suggestion.date)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {formatTime(suggestion.time)}
            </span>
          </div>
        </div>
        
        <ConflictIndicator 
          level={suggestion.conflictLevel}
          conflictDetails={suggestion.conflictDetails}
          size="sm"
          showLabel={false}
        />
      </div>

      {/* Confidence & Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <div className="flex space-x-0.5">
            {getConfidenceStars(suggestion.confidence)}
          </div>
          <span className="text-sm text-muted-foreground">
            {suggestion.confidence}% match
          </span>
        </div>

        {suggestion.confidence >= 90 && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSchedule?.(suggestion);
            }}
            disabled={isScheduling}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 text-xs"
          >
            {isScheduling ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                <span>Scheduling...</span>
              </div>
            ) : (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Quick Schedule
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  const expandedContent = (
    <div className="space-y-6">
      {/* AI Reasoning */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-primary" />
          Why this time works
        </h4>
        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          {suggestion.reason}
        </p>
      </div>

      {/* Energy Match */}
      {suggestion.energyMatch && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Energy Level</h4>
          <Badge variant="outline" className="text-xs">
            {suggestion.energyMatch}
          </Badge>
        </div>
      )}

      {/* Buffer Time */}
      {suggestion.bufferTime && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Includes Buffer</h4>
          <span className="text-sm text-muted-foreground">
            {suggestion.bufferTime} minutes for preparation
          </span>
        </div>
      )}

      {/* Alternatives */}
      {showAlternatives && alternatives.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Alternative Times</h4>
          <div className="space-y-2">
            {alternatives.slice(0, 2).map((alt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onSelectAlternative?.(alt)}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <span className="font-medium">
                      {formatDate(alt.date)} at {formatTime(alt.time)}
                    </span>
                  </div>
                  <ConflictIndicator 
                    level={alt.conflictLevel}
                    size="sm"
                    showLabel={false}
                  />
                  <div className="flex space-x-0.5">
                    {getConfidenceStars(alt.confidence)}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Button */}
      <div className="flex space-x-3 pt-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSchedule?.(suggestion);
          }}
          disabled={isScheduling}
          className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground"
        >
          {isScheduling ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Scheduling...</span>
            </div>
          ) : (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule This Time
            </>
          )}
        </Button>
        
        {alternatives.length > 2 && (
          <Button variant="outline" size="sm" className="px-4">
            +{alternatives.length - 2} more
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn("relative group", className)}>
      <DisclosureCard
        isExpanded={showDetails}
        onToggle={() => setShowDetails(!showDetails)}
        className="hover:shadow-lg transition-all duration-300"
        expandedContent={expandedContent}
      >
        {previewContent}
      </DisclosureCard>
    </div>
  );
}
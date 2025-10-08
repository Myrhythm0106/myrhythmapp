import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AssessmentConfidenceBadgeProps {
  assessmentAligned?: boolean;
  confidence: number;
  reason?: string;
  timeSlot?: string;
}

export function AssessmentConfidenceBadge({ 
  assessmentAligned, 
  confidence,
  reason,
  timeSlot 
}: AssessmentConfidenceBadgeProps) {
  // Determine badge variant based on assessment alignment
  const getVariant = () => {
    if (assessmentAligned && confidence >= 0.8) {
      return 'default'; // Green/primary
    }
    if (assessmentAligned && confidence >= 0.6) {
      return 'secondary';
    }
    if (confidence >= 0.6) {
      return 'outline';
    }
    return 'destructive';
  };

  const getIcon = () => {
    if (assessmentAligned && confidence >= 0.8) {
      return <Sparkles className="h-3 w-3" />;
    }
    if (assessmentAligned) {
      return <CheckCircle2 className="h-3 w-3" />;
    }
    if (confidence < 0.6) {
      return <AlertCircle className="h-3 w-3" />;
    }
    return null;
  };

  const getLabel = () => {
    if (assessmentAligned && confidence >= 0.8) {
      return 'Optimal Match';
    }
    if (assessmentAligned) {
      return 'Assessment Aligned';
    }
    if (confidence >= 0.8) {
      return 'High Confidence';
    }
    if (confidence >= 0.6) {
      return 'Medium Confidence';
    }
    return 'Off-Peak Time';
  };

  const getTooltipText = () => {
    if (assessmentAligned) {
      return `This time matches your stated preferences from your assessment. ${reason || ''}`;
    }
    if (confidence < 0.6) {
      return `This time is outside your stated energy peak window. Consider choosing an alternative time.`;
    }
    return reason || 'Based on calendar analysis and energy patterns';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getVariant()} className="flex items-center gap-1">
            {getIcon()}
            <span>{getLabel()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">{getTooltipText()}</p>
          {timeSlot && (
            <p className="text-xs mt-1 text-muted-foreground">
              Suggested time: {timeSlot}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

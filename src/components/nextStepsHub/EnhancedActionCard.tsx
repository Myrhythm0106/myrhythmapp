import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  Brain, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NextStepsItem } from '@/types/memoryBridge';
import { DisclosureCard } from '@/components/ui/DisclosureCard';
import { SmartSuggestionCard } from '@/components/ui/SmartSuggestionCard';
import { ConflictIndicator } from '@/components/ui/ConflictIndicator';
import { useEnhancedSmartScheduling, EnhancedSmartSuggestion } from '@/hooks/useEnhancedSmartScheduling';

interface EnhancedActionCardProps {
  action: NextStepsItem;
  onViewDetails: () => void;
  onSchedule: (suggestion: EnhancedSmartSuggestion) => Promise<void>;
  isScheduling?: boolean;
}

export function EnhancedActionCard({ 
  action, 
  onViewDetails, 
  onSchedule,
  isScheduling = false 
}: EnhancedActionCardProps) {
  const [suggestions, setSuggestions] = useState<EnhancedSmartSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { generateSmartSuggestions, isGenerating } = useEnhancedSmartScheduling();

  // Get validation and quality indicators
  const validationScore = (action as any).validation_score || 0;
  const extractionMethod = (action as any).extraction_method || 'rule-based';
  const requiresReview = (action as any).requires_review || false;
  
  const getQualityBadge = () => {
    if (extractionMethod === 'openai') {
      return <Badge variant="default" className="text-xs">🤖 AI-Extracted</Badge>;
    } else if (extractionMethod === 'manual') {
      return <Badge variant="secondary" className="text-xs">✅ Verified</Badge>;
    }
    return <Badge variant="outline" className="text-xs">⚙️ Auto-Extracted</Badge>;
  };

  const getValidationBadge = () => {
    if (validationScore >= 90) {
      return <Badge variant="default" className="text-xs bg-green-500">Quality: {validationScore}%</Badge>;
    } else if (validationScore >= 70) {
      return <Badge variant="secondary" className="text-xs">Quality: {validationScore}%</Badge>;
    } else if (validationScore > 0) {
      return <Badge variant="destructive" className="text-xs">Needs Review</Badge>;
    }
    return null;
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'action':
        return { 
          icon: Target, 
          color: 'bg-emerald-500', 
          textColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          label: 'Action' 
        };
      case 'watch_out':
        return { 
          icon: AlertCircle, 
          color: 'bg-amber-500', 
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50',
          label: 'Watch Out' 
        };
      case 'depends_on':
        return { 
          icon: Clock, 
          color: 'bg-blue-500', 
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          label: 'Depends On' 
        };
      case 'note':
        return { 
          icon: Brain, 
          color: 'bg-purple-500', 
          textColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          label: 'Note' 
        };
      default:
        return { 
          icon: Target, 
          color: 'bg-gray-500', 
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          label: 'Item' 
        };
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-red-600 bg-red-50 border-red-200';
      case 2: return 'text-orange-600 bg-orange-50 border-orange-200';
      case 3: return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in_progress': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'not_started': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleGenerateSuggestions = async () => {
    if (action.category !== 'action' || action.status === 'completed' || action.status === 'scheduled') {
      return;
    }

    try {
      const newSuggestions = await generateSmartSuggestions(
        action.action_text,
        action.completion_date || undefined,
        action.priority_level || 3,
        60 // Default 60 minutes
      );
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  const config = getCategoryConfig(action.category || 'action');
  const IconComponent = config.icon;
  const isActionable = action.category === 'action' && action.status !== 'completed' && action.status !== 'scheduled';
  const topSuggestion = suggestions.length > 0 ? suggestions[0] : null;

  const previewContent = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
            <IconComponent className={`w-5 h-5 ${config.textColor}`} />
          </div>
          <div>
            <Badge variant="secondary" className={`text-xs ${config.textColor} ${config.bgColor} border-0`}>
              {config.label}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Quality & Validation Badges */}
          {getQualityBadge()}
          {getValidationBadge()}
          {requiresReview && (
            <Badge variant="outline" className="text-xs border-amber-500 text-amber-700">
              ⚠️ Review
            </Badge>
          )}
          
          {action.priority_level && (
            <Badge className={`text-xs border ${getPriorityColor(action.priority_level)}`}>
              P{action.priority_level}
            </Badge>
          )}
          {action.status === 'completed' && (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>

      {/* Action Text */}
      <h3 className="font-semibold text-foreground mb-3 line-clamp-2 leading-snug">
        {action.action_text}
      </h3>

      {/* Smart Scheduling Preview */}
      {isActionable && topSuggestion && (
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">AI Suggests:</span>
              <span className="text-sm text-muted-foreground">
                {new Date(topSuggestion.date).toLocaleDateString()} at{' '}
                {new Date(`2000-01-01T${topSuggestion.time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
            <ConflictIndicator 
              level={topSuggestion.conflictLevel}
              size="sm"
              showLabel={false}
            />
          </div>
          <div className="flex items-center space-x-1 mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${
                  i < Math.round(topSuggestion.confidence / 20) 
                    ? "text-yellow-400 fill-current" 
                    : "text-gray-300"
                }`} 
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              {topSuggestion.confidence}% confidence
            </span>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-2">
        {action.assigned_to && action.assigned_to !== 'me' && (
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Assigned to: {action.assigned_to}
            </span>
          </div>
        )}
        
        {action.due_context && (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {action.due_context}
            </span>
          </div>
        )}

        {(action.scheduled_date || action.completion_date) && (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {action.scheduled_date 
                ? `Scheduled: ${new Date(action.scheduled_date).toLocaleDateString()}`
                : `Target: ${new Date(action.completion_date!).toLocaleDateString()}`
              }
            </span>
          </div>
        )}
      </div>

      {/* Status & Actions */}
      <div className="flex items-center justify-between pt-2">
        <Badge className={`text-xs border ${getStatusColor(action.status || 'not_started')}`}>
          {action.status?.replace('_', ' ') || 'Not Started'}
        </Badge>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isActionable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleGenerateSuggestions();
              }}
              disabled={isGenerating}
              className="text-primary hover:text-primary/80 hover:bg-primary/10 text-xs"
            >
              {isGenerating ? (
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              Schedule
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 text-xs"
          >
            Details
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );

  const expandedContent = (
    <div className="space-y-6">
      {/* Smart Scheduling Section */}
      {isActionable && suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            AI Scheduling Suggestions
          </h4>
          <div className="space-y-3">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <SmartSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                alternatives={suggestions.slice(1)}
                onSchedule={onSchedule}
                isScheduling={isScheduling}
                showAlternatives={index === 0}
                className="transform scale-95"
              />
            ))}
          </div>
        </div>
      )}

      {/* Motivation & Context */}
      {action.motivation_statement && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Why This Matters</h4>
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            {action.motivation_statement}
          </p>
        </div>
      )}

      {/* Success Criteria */}
      {action.success_criteria && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Success Criteria</h4>
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            {action.success_criteria}
          </p>
        </div>
      )}

      {/* How Steps */}
      {action.how_steps && action.how_steps.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Steps to Complete</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {action.how_steps.map((step, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Generate Suggestions Button */}
      {isActionable && suggestions.length === 0 && (
        <Button
          onClick={handleGenerateSuggestions}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating smart suggestions...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Get AI Scheduling Suggestions
            </>
          )}
        </Button>
      )}
    </div>
  );

  return (
    <DisclosureCard
      className="hover:shadow-lg transition-all duration-300"
      expandedContent={expandedContent}
      showExpandIndicator={true}
    >
      {previewContent}
    </DisclosureCard>
  );
}
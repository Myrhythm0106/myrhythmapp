import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, ChevronRight, MoreVertical, Link2, Unlink, 
  Trash2, Edit3, Eye 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { dreamCategories } from '@/data/dreamPromptSuggestions';

export interface Dream {
  id: string;
  title: string;
  why: string;
  affirmation?: string;
  emoji?: string;
  imageUrl?: string;
  category: string;
  progress: number;
  linkedGoalId?: string;
  linkedGoalTitle?: string;
  createdAt: string;
}

interface DreamCardProps {
  dream: Dream;
  onEdit: (dream: Dream) => void;
  onDelete: (dreamId: string) => void;
  onLinkGoal: (dream: Dream) => void;
  onUnlinkGoal: (dreamId: string) => void;
  onViewJourney: (dream: Dream) => void;
  index?: number;
}

export function DreamCard({
  dream,
  onEdit,
  onDelete,
  onLinkGoal,
  onUnlinkGoal,
  onViewJourney,
  index = 0
}: DreamCardProps) {
  const category = dreamCategories.find(c => c.id === dream.category);
  const displayEmoji = dream.emoji || category?.emoji || "✨";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="relative group"
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-card border-2 border-border/60",
        "shadow-sm hover:shadow-md transition-all duration-300",
        "hover:border-brain-health-300"
      )}>
        {/* Optional Image Header */}
        {dream.imageUrl && (
          <div className="relative h-32 overflow-hidden">
            <img 
              src={dream.imageUrl} 
              alt={dream.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          </div>
        )}

        {/* Card Content */}
        <div className="p-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Emoji/Icon */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                "bg-gradient-to-br from-brain-health-100 to-clarity-teal-100",
                "text-2xl"
              )}>
                {displayEmoji}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground text-lg leading-tight truncate">
                  {dream.title}
                </h3>
                {category && (
                  <span className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium mt-1",
                    "px-2 py-0.5 rounded-full",
                    `bg-${category.color}-100 text-${category.color}-700`
                  )}>
                    {category.label}
                  </span>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(dream)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Dream
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewJourney(dream)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Journey
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {dream.linkedGoalId ? (
                  <DropdownMenuItem onClick={() => onUnlinkGoal(dream.id)}>
                    <Unlink className="h-4 w-4 mr-2" />
                    Unlink Goal
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onLinkGoal(dream)}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Create Goal from Dream
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(dream.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Dream
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Why Statement */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {dream.why}
          </p>

          {/* Progress */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-brain-health-600">{dream.progress}%</span>
            </div>
            <Progress value={dream.progress} className="h-2" />
          </div>

          {/* Linked Goal */}
          {dream.linkedGoalId && dream.linkedGoalTitle && (
            <button
              onClick={() => onViewJourney(dream)}
              className={cn(
                "w-full flex items-center justify-between gap-2 p-3 rounded-xl",
                "bg-brain-health-50/80 border border-brain-health-200",
                "text-left hover:bg-brain-health-100 transition-colors"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Target className="h-4 w-4 text-brain-health-600 flex-shrink-0" />
                <span className="text-sm font-medium text-brain-health-700 truncate">
                  {dream.linkedGoalTitle}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-brain-health-400 flex-shrink-0" />
            </button>
          )}

          {/* Create Goal CTA */}
          {!dream.linkedGoalId && (
            <button
              onClick={() => onLinkGoal(dream)}
              className={cn(
                "w-full flex items-center justify-center gap-2 p-3 rounded-xl",
                "border-2 border-dashed border-brain-health-200",
                "text-sm font-medium text-brain-health-600",
                "hover:bg-brain-health-50 hover:border-brain-health-300",
                "transition-all duration-200"
              )}
            >
              <Link2 className="h-4 w-4" />
              Make this a Goal
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

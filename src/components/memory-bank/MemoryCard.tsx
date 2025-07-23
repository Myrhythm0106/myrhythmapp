import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MemoryEntry } from '@/hooks/useMemoryBank';
import { Heart, MessageCircle, Share2, FileText, Camera, Mic, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { WatchersDisplay } from '@/components/shared/WatchersDisplay';

interface MemoryCardProps {
  memory: MemoryEntry;
  onView: (memory: MemoryEntry) => void;
  onToggleFavorite: (memory: MemoryEntry) => void;
  onShare: (memory: MemoryEntry) => void;
  className?: string;
}

const categoryColors = {
  general: 'bg-gradient-primary',
  family: 'bg-gradient-secondary',
  achievement: 'bg-gradient-accent',
  medical: 'bg-gradient-tertiary',
  milestone: 'bg-gradient-success',
};

const typeIcons = {
  text: FileText,
  photo: Camera,
  voice: Mic,
};

export function MemoryCard({ 
  memory, 
  onView, 
  onToggleFavorite, 
  onShare,
  className 
}: MemoryCardProps) {
  const TypeIcon = typeIcons[memory.memory_type];
  const categoryColor = categoryColors[memory.category as keyof typeof categoryColors] || 'bg-gradient-primary';

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50 hover:border-primary/30",
      className
    )}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <TypeIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {memory.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(memory.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(memory);
            }}
            className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-colors",
                memory.is_favorite 
                  ? "fill-red-500 text-red-500" 
                  : "text-muted-foreground hover:text-red-500"
              )} 
            />
          </Button>
        </div>

        {/* Content Preview */}
        {memory.content && memory.memory_type === 'text' && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {memory.content}
          </p>
        )}

        {memory.memory_type === 'photo' && (
          <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        {memory.memory_type === 'voice' && (
          <div className="h-16 bg-muted rounded-lg flex items-center justify-center">
            <Mic className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        {/* Tags */}
        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {memory.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {memory.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{memory.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Category */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn("text-xs capitalize", categoryColor, "text-white border-0")}
          >
            {memory.category}
          </Badge>
          
          {memory.visibility_level !== 'private' && (
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground capitalize">
                {memory.visibility_level}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(memory)}
            className="text-xs h-8 px-3"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onShare(memory);
              }}
              className="text-xs h-8 px-3"
            >
              <Share2 className="w-3 h-3 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
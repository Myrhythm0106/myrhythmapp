
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { GratitudeEntry } from "../GratitudePrompt";
import { 
  Share2, 
  Eye, 
  Calendar, 
  Heart, 
  Trash2, 
  Edit,
  MessageSquare 
} from "lucide-react";
import { toast } from "sonner";

interface GratitudeEntryCardProps {
  entry: GratitudeEntry;
  onSelectEntry: (entry: GratitudeEntry) => void;
  onShareEntry: (entry: GratitudeEntry) => void;
  onDeleteEntry?: (entry: GratitudeEntry) => void;
  onEditEntry?: (entry: GratitudeEntry) => void;
}

export function GratitudeEntryCard({ 
  entry, 
  onSelectEntry, 
  onShareEntry,
  onDeleteEntry,
  onEditEntry
}: GratitudeEntryCardProps) {
  const isMobile = useIsMobile();

  const getPromptTypeColor = (type: string) => {
    switch (type) {
      case "fitness": return "bg-blue-100 text-blue-800";
      case "mindfulness": return "bg-green-100 text-green-800";
      case "social": return "bg-purple-100 text-purple-800";
      case "general": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPromptTypeIcon = (type: string) => {
    switch (type) {
      case "fitness": return "💪";
      case "mindfulness": return "🧘";
      case "social": return "👥";
      case "general": return "✨";
      default: return "📝";
    }
  };

  const handleDelete = () => {
    if (onDeleteEntry) {
      onDeleteEntry(entry);
      toast.success("Gratitude entry deleted", { duration: 2000 });
    }
  };

  const handleEdit = () => {
    if (onEditEntry) {
      onEditEntry(entry);
    } else {
      onSelectEntry(entry);
    }
  };

  const handleShare = () => {
    onShareEntry(entry);
    toast.success("Sharing options opened", { duration: 2000 });
  };

  return (
    <SwipeableContainer
      enableHorizontalSwipe={isMobile}
      onSwipeLeft={{
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        color: "#ef4444",
        action: handleDelete
      }}
      onSwipeRight={{
        label: "Share",
        icon: <Share2 className="h-4 w-4" />,
        color: "#22c55e", 
        action: handleShare
      }}
      className="w-full"
    >
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getPromptTypeIcon(entry.promptType)}</span>
              <Badge 
                variant="secondary" 
                className={getPromptTypeColor(entry.promptType)}
              >
                {entry.promptType}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(entry.date).toLocaleDateString()}
            </div>
          </div>
          
          <div className="space-y-3">
            {entry.prompt && (
              <div className="text-sm text-muted-foreground italic border-l-2 border-muted pl-3">
                "{entry.prompt}"
              </div>
            )}
            
            <p 
              className="text-sm font-medium leading-relaxed cursor-pointer"
              onClick={() => onSelectEntry(entry)}
            >
              {entry.gratitudeText}
            </p>
            
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {entry.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {entry.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{entry.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {entry.mood && (
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span className="capitalize">{entry.mood}</span>
                </div>
              )}
              {entry.linkedActivity && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{entry.linkedActivity}</span>
                </div>
              )}
            </div>
            
            {!isMobile && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEntry(entry);
                  }}
                  className="h-7 w-7 p-0"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                  className="h-7 w-7 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="h-7 w-7 p-0"
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile swipe hint */}
      {isMobile && (
        <div className="text-center mt-1">
          <p className="text-xs text-muted-foreground">
            💡 Swipe right to share • Swipe left to delete
          </p>
        </div>
      )}
    </SwipeableContainer>
  );
}

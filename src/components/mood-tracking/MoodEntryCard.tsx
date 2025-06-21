
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Share2, Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  energy: number;
  notes?: string;
  activities?: string[];
  triggers?: string[];
}

interface MoodEntryCardProps {
  entry: MoodEntry;
  onEdit?: (entry: MoodEntry) => void;
  onDelete?: (entry: MoodEntry) => void;
  onShare?: (entry: MoodEntry) => void;
}

export function MoodEntryCard({ entry, onEdit, onDelete, onShare }: MoodEntryCardProps) {
  const isMobile = useIsMobile();

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return "😔";
    if (mood <= 4) return "😐";
    if (mood <= 6) return "🙂";
    if (mood <= 8) return "😊";
    return "😄";
  };

  const getEnergyLevel = (energy: number) => {
    if (energy <= 2) return "Low";
    if (energy <= 4) return "Fair";
    if (energy <= 6) return "Good";
    if (energy <= 8) return "High";
    return "Excellent";
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(entry);
    } else {
      toast.info(`Edit mood entry for ${format(entry.date, 'MMM d')}`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(entry);
    } else {
      toast.success("Mood entry deleted", { duration: 2000 });
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(entry);
    } else {
      toast.success("Sharing mood entry", { duration: 2000 });
    }
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
        label: "Edit",
        icon: <Edit3 className="h-4 w-4" />,
        color: "#3b82f6",
        action: handleEdit
      }}
      className="w-full"
    >
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
              <div>
                <p className="font-medium">{format(entry.date, 'EEEE, MMM d')}</p>
                <p className="text-sm text-muted-foreground">
                  Mood: {entry.mood}/10 • Energy: {getEnergyLevel(entry.energy)}
                </p>
              </div>
            </div>
            {!isMobile && (
              <div className="flex gap-1">
                <button
                  onClick={handleEdit}
                  className="p-1 hover:bg-muted rounded"
                  title="Edit entry"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-1 hover:bg-muted rounded"
                  title="Share entry"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 hover:bg-muted rounded text-destructive"
                  title="Delete entry"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {entry.notes && (
            <p className="text-sm mb-3 bg-muted/50 p-2 rounded">
              {entry.notes}
            </p>
          )}

          <div className="space-y-2">
            {entry.activities && entry.activities.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Activities:</p>
                <div className="flex flex-wrap gap-1">
                  {entry.activities.map((activity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {entry.triggers && entry.triggers.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Triggers:</p>
                <div className="flex flex-wrap gap-1">
                  {entry.triggers.map((trigger, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {trigger}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </SwipeableContainer>
  );
}

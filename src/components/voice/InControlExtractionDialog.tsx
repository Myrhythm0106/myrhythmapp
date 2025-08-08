import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, CheckCircle, Target, Clock, User, FileText, AlertTriangle, Lightbulb, Star } from 'lucide-react';
import { InControlItem } from '@/types/memoryBridge';

interface InControlExtractionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isProcessing: boolean;
  extractedItems: InControlItem[];
  onConfirm: () => void;
  processingStage: 'transcribing' | 'analyzing' | 'extracting' | 'categorizing' | 'complete';
}

const INCONTROL_ICONS = {
  intentions: Target,
  next_steps: CheckCircle,
  commitments: User,
  outcomes: Star,
  notes: FileText,
  timelines: Clock,
  resources: FileText,
  obstacles: AlertTriangle,
  learning: Lightbulb
};

const INCONTROL_COLORS = {
  intentions: 'bg-blue-100 text-blue-800 border-blue-200',
  next_steps: 'bg-green-100 text-green-800 border-green-200',
  commitments: 'bg-purple-100 text-purple-800 border-purple-200',
  outcomes: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  notes: 'bg-gray-100 text-gray-800 border-gray-200',
  timelines: 'bg-orange-100 text-orange-800 border-orange-200',
  resources: 'bg-teal-100 text-teal-800 border-teal-200',
  obstacles: 'bg-red-100 text-red-800 border-red-200',
  learning: 'bg-indigo-100 text-indigo-800 border-indigo-200'
};

export function InControlExtractionDialog({
  open,
  onOpenChange,
  isProcessing,
  extractedItems,
  onConfirm,
  processingStage
}: InControlExtractionDialogProps) {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (isProcessing) {
      const stageProgress = {
        transcribing: 25,
        analyzing: 50,
        extracting: 75,
        categorizing: 90,
        complete: 100
      };
      setProgress(stageProgress[processingStage]);
    }
  }, [processingStage, isProcessing]);

  const groupedItems = extractedItems.reduce((acc, item) => {
    const type = item.action_type || 'notes';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, InControlItem[]>);

  const getStageMessage = () => {
    switch (processingStage) {
      case 'transcribing':
        return 'Converting your voice to text...';
      case 'analyzing':
        return 'Understanding the conversation...';
      case 'extracting':
        return 'Finding InControl items...';
      case 'categorizing':
        return 'Organizing into the InControl framework...';
      case 'complete':
        return 'InControl extraction complete!';
      default:
        return 'Processing...';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-[hsl(var(--brain-health))]" />
            InControl Extraction
          </DialogTitle>
          <DialogDescription>
            Converting your recording into actionable InControl items
          </DialogDescription>
        </DialogHeader>

        {isProcessing ? (
          <div className="space-y-6 py-8">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-[hsl(var(--brain-health))]" />
              <div className="space-y-2">
                <p className="text-lg font-medium">{getStageMessage()}</p>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">{progress}% complete</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {extractedItems.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg">No InControl items found in this recording.</p>
                <p className="text-sm text-muted-foreground">
                  Try recording a conversation with specific commitments or next steps.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-[hsl(var(--brain-health))]/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    🎉 Found {extractedItems.length} InControl items!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Review and confirm these items to add them to your InControl Log.
                  </p>
                </div>

                <div className="space-y-4">
                  {Object.entries(groupedItems).map(([type, items]) => {
                    const Icon = INCONTROL_ICONS[type as keyof typeof INCONTROL_ICONS] || FileText;
                    const colorClass = INCONTROL_COLORS[type as keyof typeof INCONTROL_COLORS] || 'bg-gray-100 text-gray-800';
                    
                    return (
                      <Card key={type} className="border-l-4 border-l-[hsl(var(--brain-health))]">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Icon className="h-5 w-5" />
                            <Badge className={colorClass}>
                              {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {items.length} item{items.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            {items.map((item, index) => (
                              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                                <p className="font-medium">{item.action_text}</p>
                                {item.assigned_to && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Assigned to: {item.assigned_to}
                                  </p>
                                )}
                                {item.due_context && (
                                  <p className="text-sm text-muted-foreground">
                                    Timeline: {item.due_context}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    Priority: {item.priority_level}/5
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Confidence: {Math.round((item.confidence_score || 0) * 100)}%
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={onConfirm}
                    className="flex-1 bg-[hsl(var(--brain-health))] hover:bg-[hsl(var(--brain-health))]/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm & Add to InControl Log
                  </Button>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
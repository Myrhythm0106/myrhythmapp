import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';

interface SimplifiedActionViewProps {
  actions: ExtractedAction[];
  onActionComplete: (actionId: string) => void;
  maxVisible?: number;
}

export function SimplifiedActionView({ 
  actions, 
  onActionComplete,
  maxVisible = 3 
}: SimplifiedActionViewProps) {
  const [showAll, setShowAll] = useState(false);
  
  const sortedActions = [...actions]
    .filter(a => a.status !== 'rejected' && a.status !== 'completed')
    .sort((a, b) => (b.priority_level || 0) - (a.priority_level || 0));
  
  const visibleActions = showAll ? sortedActions : sortedActions.slice(0, maxVisible);
  const hiddenCount = sortedActions.length - maxVisible;

  if (sortedActions.length === 0) {
    return (
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-900">All Clear! 🌟</h3>
          <p className="text-sm text-green-700 mt-1">
            You've completed all your care steps. Take a moment to rest and recharge.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-purple-900">Today's Care Steps</h3>
          <Badge variant="outline" className="text-purple-700">
            {sortedActions.length} active
          </Badge>
        </div>

        <div className="space-y-2">
          {visibleActions.map((action, index) => (
            <Card 
              key={action.id} 
              className="bg-white border-l-4 border-l-purple-400 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        Step {index + 1}
                      </Badge>
                      {action.priority_level >= 4 && (
                        <Badge className="text-xs bg-red-100 text-red-700">
                          Important
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{action.action_text}</p>
                    {action.relationship_impact && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        💜 {action.relationship_impact}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onActionComplete(action.id)}
                    className="shrink-0"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {hiddenCount > 0 && !showAll && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAll(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Show {hiddenCount} More Care Steps
          </Button>
        )}

        {showAll && sortedActions.length > maxVisible && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAll(false)}
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Show Less
          </Button>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Remember:</strong> Focus on one care step at a time. Progress over perfection. 
            You're doing great! 🌱
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

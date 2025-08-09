import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { CheckCircle, XCircle, Heart, Clock } from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';

export function ExtractedActionsReview() {
  const { extractedActions, fetchExtractedActions, confirmAction } = useMemoryBridge();

  useEffect(() => {
    fetchExtractedActions();
  }, [fetchExtractedActions]);

  const handleConfirmAction = async (action: ExtractedAction, status: 'confirmed' | 'rejected') => {
    await confirmAction(action.id, status);
  };

  if (extractedActions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Actions Yet</h3>
          <p className="text-muted-foreground">
            Start a Memory Bridge recording to capture commitments and promises
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Promise Keeper Dashboard</h2>
      
      {extractedActions.map((action) => (
        <Card key={action.id} className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-lg">{action.action_text}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{action.action_type}</Badge>
                  <Badge variant="secondary">Priority {action.priority_level}</Badge>
                  {action.confidence_score && (
                    <Badge variant="outline">
                      {Math.round(action.confidence_score * 100)}% confident
                    </Badge>
                  )}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {action.emotional_stakes && (
              <div>
                <p className="text-sm font-medium text-primary mb-1">Why This Matters:</p>
                <p className="text-sm text-muted-foreground">{action.emotional_stakes}</p>
              </div>
            )}
            
            {action.relationship_impact && (
              <div>
                <p className="text-sm font-medium text-primary mb-1">Relationship Impact:</p>
                <p className="text-sm text-muted-foreground">{action.relationship_impact}</p>
              </div>
            )}
            
            {action.due_context && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>When: {action.due_context}</span>
              </div>
            )}
            
            {action.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleConfirmAction(action, 'confirmed')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
                <Button
                  onClick={() => handleConfirmAction(action, 'rejected')}
                  variant="outline"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Not Accurate
                </Button>
              </div>
            )}
            
            {action.status !== 'pending' && (
              <Badge variant={action.status === 'confirmed' ? 'default' : 'secondary'}>
                {action.status}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
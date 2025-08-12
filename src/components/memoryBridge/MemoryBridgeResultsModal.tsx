import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExtractedAction } from '@/types/memoryBridge';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { 
  CheckCircle, 
  Calendar, 
  Share2, 
  Brain, 
  Heart, 
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

interface MemoryBridgeResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
  actionsFound: number;
  summary?: string;
}

export function MemoryBridgeResultsModal({ 
  isOpen, 
  onClose, 
  meetingId, 
  actionsFound, 
  summary 
}: MemoryBridgeResultsModalProps) {
  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchExtractedActions, confirmAction } = useMemoryBridge();

  useEffect(() => {
    if (isOpen && meetingId) {
      loadActions();
    }
  }, [isOpen, meetingId]);

  const loadActions = async () => {
    try {
      setIsLoading(true);
      const actions = await fetchExtractedActions(meetingId);
      setExtractedActions(actions || []);
    } catch (error) {
      console.error('Failed to load actions:', error);
      toast.error('Failed to load extracted actions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionConfirm = async (actionId: string) => {
    try {
      await confirmAction(actionId, 'confirmed');
      setExtractedActions(prev => 
        prev.map(action => 
          action.id === actionId 
            ? { ...action, status: 'confirmed' as const }
            : action
        )
      );
      toast.success('Action confirmed!');
    } catch (error) {
      toast.error('Failed to confirm action');
    }
  };

  const handleScheduleAction = (action: ExtractedAction) => {
    // TODO: Navigate to calendar with pre-filled action
    toast.success('Action ready for scheduling!');
    onClose();
  };

  const categorizeActions = (actions: ExtractedAction[]) => {
    return {
      awareness: actions.filter(a => 
        a.action_type === 'reminder' || 
        a.action_text.toLowerCase().includes('remember') ||
        a.action_text.toLowerCase().includes('aware')
      ),
      change: actions.filter(a => 
        a.action_type === 'commitment' || 
        a.action_text.toLowerCase().includes('change') ||
        a.action_text.toLowerCase().includes('improve')
      ),
      action: actions.filter(a => 
        a.action_type === 'task' || 
        a.action_type === 'follow_up' ||
        a.action_text.toLowerCase().includes('do') ||
        a.action_text.toLowerCase().includes('call') ||
        a.action_text.toLowerCase().includes('schedule')
      )
    };
  };

  const categorizedActions = categorizeActions(extractedActions);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Memory Bridge Results
          </DialogTitle>
        </DialogHeader>

        {/* Celebration Header */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">{actionsFound}</div>
              <p className="text-green-800">Actions Extracted!</p>
              {summary && (
                <p className="text-sm text-green-700 mt-2">{summary}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading your actions...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* A.C.T.S. Framework Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Awareness */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">AWARENESS</h3>
                  </div>
                  <div className="space-y-2">
                    {categorizedActions.awareness.length === 0 ? (
                      <p className="text-sm text-blue-600">No awareness items found</p>
                    ) : (
                      categorizedActions.awareness.map(action => (
                        <div key={action.id} className="bg-white p-3 rounded border">
                          <p className="text-sm font-medium mb-1">{action.action_text}</p>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-xs">
                              Priority {action.priority_level}
                            </Badge>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => handleActionConfirm(action.id)}
                                disabled={action.status === 'confirmed'}
                              >
                                <CheckCircle className={`h-3 w-3 ${action.status === 'confirmed' ? 'text-green-600' : 'text-gray-400'}`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Change */}
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">CHANGE</h3>
                  </div>
                  <div className="space-y-2">
                    {categorizedActions.change.length === 0 ? (
                      <p className="text-sm text-green-600">No change commitments found</p>
                    ) : (
                      categorizedActions.change.map(action => (
                        <div key={action.id} className="bg-white p-3 rounded border">
                          <p className="text-sm font-medium mb-1">{action.action_text}</p>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-xs">
                              Priority {action.priority_level}
                            </Badge>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => handleActionConfirm(action.id)}
                                disabled={action.status === 'confirmed'}
                              >
                                <CheckCircle className={`h-3 w-3 ${action.status === 'confirmed' ? 'text-green-600' : 'text-gray-400'}`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action */}
              <Card className="border-purple-200 bg-purple-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">ACTION</h3>
                  </div>
                  <div className="space-y-2">
                    {categorizedActions.action.length === 0 ? (
                      <p className="text-sm text-purple-600">No action items found</p>
                    ) : (
                      categorizedActions.action.map(action => (
                        <div key={action.id} className="bg-white p-3 rounded border">
                          <p className="text-sm font-medium mb-1">{action.action_text}</p>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-xs">
                              Priority {action.priority_level}
                            </Badge>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => handleActionConfirm(action.id)}
                                disabled={action.status === 'confirmed'}
                              >
                                <CheckCircle className={`h-3 w-3 ${action.status === 'confirmed' ? 'text-green-600' : 'text-gray-400'}`} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => handleScheduleAction(action)}
                              >
                                <Calendar className="h-3 w-3 text-blue-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Review Later
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share with Circle
                </Button>
                <Button className="flex items-center gap-2 bg-primary">
                  <Calendar className="h-4 w-4" />
                  Schedule Actions
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
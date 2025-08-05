import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { CheckCircle, X, Calendar, Clock, Target, Users } from 'lucide-react';

export function PACTBatchOperations() {
  const { extractedActions, confirmAction } = useMemoryBridge();
  const [selectedPACTs, setSelectedPACTs] = useState<string[]>([]);
  const [batchAction, setBatchAction] = useState<string | null>(null);

  const pendingPACTs = extractedActions.filter(a => a.status === 'pending');

  const handleSelectAll = () => {
    if (selectedPACTs.length === pendingPACTs.length) {
      setSelectedPACTs([]);
    } else {
      setSelectedPACTs(pendingPACTs.map(p => p.id));
    }
  };

  const handleSelectPACT = (pactId: string) => {
    setSelectedPACTs(prev => 
      prev.includes(pactId) 
        ? prev.filter(id => id !== pactId)
        : [...prev, pactId]
    );
  };

  const handleBatchConfirm = async () => {
    for (const pactId of selectedPACTs) {
      await confirmAction(pactId, 'confirmed');
    }
    setSelectedPACTs([]);
    setBatchAction(null);
  };

  const handleBatchReject = async () => {
    for (const pactId of selectedPACTs) {
      await confirmAction(pactId, 'rejected');
    }
    setSelectedPACTs([]);
    setBatchAction(null);
  };

  const handleBatchSchedule = () => {
    setBatchAction('schedule');
    // This would open a scheduling dialog for all selected PACTs
  };

  const getQuickFilterGroups = () => {
    return {
      highPriority: pendingPACTs.filter(p => p.priority_level > 7),
      lowConfidence: pendingPACTs.filter(p => p.confidence_score && p.confidence_score < 0.7),
      oldPACTs: pendingPACTs.filter(p => {
        const daysDiff = Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff > 3;
      }),
      todayRelevant: pendingPACTs.filter(p => p.due_context && p.due_context.toLowerCase().includes('today'))
    };
  };

  const quickFilters = getQuickFilterGroups();

  return (
    <div className="space-y-6">
      {/* Batch Operations Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="h-5 w-5" />
            Batch PACT Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            Efficiently process multiple PACTs at once. Select items and choose an action.
          </p>
          
          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedPACTs(quickFilters.highPriority.map(p => p.id))}
            >
              High Priority ({quickFilters.highPriority.length})
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedPACTs(quickFilters.lowConfidence.map(p => p.id))}
            >
              Low Confidence ({quickFilters.lowConfidence.length})
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedPACTs(quickFilters.oldPACTs.map(p => p.id))}
            >
              Older than 3 days ({quickFilters.oldPACTs.length})
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedPACTs(quickFilters.todayRelevant.map(p => p.id))}
            >
              Due Today ({quickFilters.todayRelevant.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* PACT Selection List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Pending PACTs ({pendingPACTs.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedPACTs.length === pendingPACTs.length && pendingPACTs.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">Select All</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pendingPACTs.map((pact) => (
                  <div 
                    key={pact.id} 
                    className={`p-4 rounded-lg border transition-all ${
                      selectedPACTs.includes(pact.id) 
                        ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={selectedPACTs.includes(pact.id)}
                        onCheckedChange={() => handleSelectPACT(pact.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-2">{pact.action_text}</p>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Priority: {pact.priority_level}/10
                          </Badge>
                          {pact.confidence_score && (
                            <Badge 
                              variant={pact.confidence_score > 0.7 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {Math.round(pact.confidence_score * 100)}% confidence
                            </Badge>
                          )}
                          {pact.assigned_to && (
                            <Badge variant="outline" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {pact.assigned_to}
                            </Badge>
                          )}
                        </div>
                        {pact.due_context && (
                          <p className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {pact.due_context}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {pendingPACTs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No pending PACTs to process!</p>
                    <p className="text-sm">All caught up - great work!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batch Actions Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Batch Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Selected: {selectedPACTs.length} PACTs
              </div>

              {selectedPACTs.length > 0 && (
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleBatchConfirm}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm All ({selectedPACTs.length})
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleBatchReject}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject All ({selectedPACTs.length})
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleBatchSchedule}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule All ({selectedPACTs.length})
                  </Button>
                </div>
              )}

              {selectedPACTs.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select PACTs to enable batch actions</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <h4 className="font-medium text-sm">Quick Stats</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>High Priority:</span>
                  <span>{quickFilters.highPriority.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Low Confidence:</span>
                  <span>{quickFilters.lowConfidence.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Older than 3 days:</span>
                  <span>{quickFilters.oldPACTs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Due Today:</span>
                  <span>{quickFilters.todayRelevant.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
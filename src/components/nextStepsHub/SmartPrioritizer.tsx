import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Clock, 
  Zap, 
  Target,
  ArrowUpDown,
  CheckCircle,
  Play,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { toast } from 'sonner';

interface SmartPrioritizerProps {
  actions: NextStepsItem[];
  onActionUpdate: () => void;
  currentEnergyLevel: 'high' | 'medium' | 'low';
}

export function SmartPrioritizer({ actions, onActionUpdate, currentEnergyLevel }: SmartPrioritizerProps) {
  const [sortedActions, setSortedActions] = useState(() => {
    return [...actions].filter(a => !['done', 'completed', 'confirmed'].includes(a.status));
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newActions = Array.from(sortedActions);
    const [reorderedItem] = newActions.splice(result.source.index, 1);
    newActions.splice(result.destination.index, 0, reorderedItem);

    setSortedActions(newActions);
    toast.success('Priority updated! Your brain loves this kind of organization 🧠');
  };

  const getEnergyMatch = (action: NextStepsItem) => {
    // Simple heuristic for energy matching
    const actionText = action.action_text?.toLowerCase() || '';
    
    if (actionText.includes('call') || actionText.includes('meeting') || actionText.includes('present')) {
      return 'high';
    } else if (actionText.includes('email') || actionText.includes('write') || actionText.includes('plan')) {
      return 'medium';
    } else {
      return 'low';
    }
  };

  const getUrgencyLevel = (action: NextStepsItem) => {
    if (action.due_context?.includes('today') || action.due_context?.includes('asap')) return 'urgent';
    if (action.due_context?.includes('tomorrow') || action.due_context?.includes('soon')) return 'high';
    if (action.due_context?.includes('week')) return 'medium';
    return 'low';
  };

  const getEnergyIcon = (energyLevel: string) => {
    switch (energyLevel) {
      case 'high': return <Zap className="h-4 w-4 text-red-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Clock className="h-4 w-4 text-green-500" />;
      default: return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const smartSort = () => {
    const sorted = [...sortedActions].sort((a, b) => {
      // Energy match bonus
      const aEnergyMatch = getEnergyMatch(a) === currentEnergyLevel ? 10 : 0;
      const bEnergyMatch = getEnergyMatch(b) === currentEnergyLevel ? 10 : 0;
      
      // Urgency score
      const urgencyScores = { urgent: 20, high: 15, medium: 10, low: 5 };
      const aUrgency = urgencyScores[getUrgencyLevel(a) as keyof typeof urgencyScores] || 0;
      const bUrgency = urgencyScores[getUrgencyLevel(b) as keyof typeof urgencyScores] || 0;
      
      // Confidence score
      const aConfidence = (a.confidence_score || 0) * 5;
      const bConfidence = (b.confidence_score || 0) * 5;
      
      const aScore = aEnergyMatch + aUrgency + aConfidence;
      const bScore = bEnergyMatch + bUrgency + bConfidence;
      
      return bScore - aScore;
    });
    
    setSortedActions(sorted);
    toast.success('Actions prioritized using brain-friendly intelligence! 🧠✨');
  };

  const getSmartSuggestion = (action: NextStepsItem) => {
    const energyMatch = getEnergyMatch(action);
    const urgency = getUrgencyLevel(action);
    
    if (energyMatch === currentEnergyLevel && urgency === 'urgent') {
      return "🎯 Perfect match! Do this now.";
    } else if (energyMatch === currentEnergyLevel) {
      return "⚡ Great energy match for you right now.";
    } else if (urgency === 'urgent') {
      return "🚨 Time-sensitive - consider tackling soon.";
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Smart Prioritizer
            <Badge className="bg-purple-100 text-purple-800">
              {sortedActions.length} actions
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={smartSort}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <Brain className="h-4 w-4 mr-2" />
              Smart Sort
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-600"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Manual
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="actions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {sortedActions.map((action, index) => (
                    <Draggable key={action.id || index} draggableId={action.id || index.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`group ${snapshot.isDragging ? 'opacity-50' : ''}`}
                        >
                          <Card className={`p-4 border-l-4 border-l-purple-300 hover:shadow-md transition-all cursor-move
                            ${getEnergyMatch(action) === currentEnergyLevel ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-green-400' : ''}
                          `}>
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                    {getEnergyIcon(getEnergyMatch(action))}
                                    <Badge 
                                      variant="secondary" 
                                      className={getUrgencyColor(getUrgencyLevel(action))}
                                    >
                                      {getUrgencyLevel(action)}
                                    </Badge>
                                  </div>
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    {action.action_text}
                                  </h4>
                                  
                                  {action.due_context && (
                                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                                      <Clock className="h-3 w-3" />
                                      {action.due_context}
                                    </div>
                                  )}

                                  {getSmartSuggestion(action) && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-yellow-800">
                                      {getSmartSuggestion(action)}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Calendar className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                    <Play className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Micro-steps preview */}
                              {action.action_text && action.action_text.length > 50 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                                  <p className="text-xs text-blue-800 mb-1">
                                    🧠 <strong>Brain-friendly breakdown:</strong>
                                  </p>
                                  <ul className="text-xs text-blue-700 space-y-1">
                                    <li>• Open necessary tools/apps</li>
                                    <li>• Set a 25-minute timer</li>
                                    <li>• Complete the main task</li>
                                    <li>• Take a 5-minute brain break</li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { ExtractedAction } from '@/types/memoryBridge';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search, 
  GripVertical,
  Heart,
  Users,
  Calendar,
  Edit3,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface SeniorPACTTableProps {
  extractedActions: ExtractedAction[];
}

export function SeniorPACTTable({ extractedActions }: SeniorPACTTableProps) {
  const { confirmAction, updateExtractedAction } = useMemoryBridge();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredActions, setFilteredActions] = useState(extractedActions);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  React.useEffect(() => {
    let filtered = extractedActions;
    
    if (searchTerm) {
      filtered = filtered.filter(action =>
        action.action_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(action => action.status === statusFilter);
    }
    
    setFilteredActions(filtered);
  }, [extractedActions, searchTerm, statusFilter]);

  const handleStatusUpdate = async (actionId: string, newStatus: 'confirmed' | 'completed' | 'rejected') => {
    try {
      if (newStatus === 'confirmed' || newStatus === 'rejected') {
        await confirmAction(actionId, newStatus);
      } else {
        await updateExtractedAction(actionId, { status: newStatus });
      }
      
      const statusMessages = {
        confirmed: 'Promise confirmed! 💜',
        completed: 'Promise completed! Well done! ✨',
        rejected: 'Marked as not accurate'
      };
      
      toast.success(statusMessages[newStatus]);
    } catch (error) {
      toast.error('Failed to update promise status');
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(filteredActions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFilteredActions(items);
    toast.success('Promise order updated');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'confirmed':
        return 'bg-brain-health/10 text-brain-health border-brain-health/20';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'rejected':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityHearts = (priority: number) => {
    const heartCount = Math.ceil(priority / 2);
    return [...Array(5)].map((_, i) => (
      <Heart 
        key={i} 
        className={`h-4 w-4 ${
          i < heartCount ? 'text-red-400 fill-current' : 'text-gray-200'
        }`} 
      />
    ));
  };

  if (extractedActions.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto mb-4 text-brain-health/40" />
        <h3 className="text-xl font-semibold text-brain-health mb-3">No Promises Found</h3>
        <p className="text-muted-foreground text-lg">
          Record conversations to start tracking your commitments
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search your promises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-lg py-3"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'completed'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status === 'all' ? 'All' : status}
            </Button>
          ))}
        </div>
      </div>

      {/* Draggable Promise Cards */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="pact-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {filteredActions.map((action, index) => (
                <Draggable key={action.id} draggableId={action.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border-l-4 border-l-brain-health transition-all ${
                        snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="flex flex-col items-center justify-center p-2 text-gray-400 hover:text-brain-health cursor-grab"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 space-y-4">
                            {/* Header with Status */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Heart className="h-5 w-5 text-brain-health flex-shrink-0" />
                                  <span className="text-sm font-medium text-brain-health uppercase tracking-wide">
                                    {action.action_type === 'commitment' ? 'My Promise' : 
                                     action.action_type === 'promise' ? 'Promise Made' : 
                                     action.action_type === 'reminder' ? 'Don\'t Forget' : 'Action Needed'}
                                  </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 leading-relaxed mb-3">
                                  {action.action_text}
                                </h3>
                              </div>
                              
                              <Badge className={`${getStatusColor(action.status)} text-sm font-medium`}>
                                {action.status === 'completed' ? '✓ Done' :
                                 action.status === 'confirmed' ? '✓ Confirmed' :
                                 action.status === 'rejected' ? '✗ Not Accurate' : 'Needs Review'}
                              </Badge>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Priority and Due Date */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-brain-health" />
                                    <span className="text-sm font-medium">Due Date</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-muted-foreground">Priority:</span>
                                    <div className="flex">{getPriorityHearts(action.priority_level)}</div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700">
                                  {action.due_context || 'No deadline set'}
                                </p>
                              </div>

                              {/* Assigned To */}
                              {action.assigned_to && (
                                <div className="bg-blue-50 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Users className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium text-blue-800">Assigned To</span>
                                  </div>
                                  <p className="text-sm text-blue-700">{action.assigned_to}</p>
                                </div>
                              )}
                            </div>

                            {/* Emotional Context */}
                            {action.emotional_stakes && (
                              <div className="bg-gradient-to-r from-brain-health/5 to-emerald/5 rounded-lg p-4 border border-brain-health/10">
                                <div className="flex items-start gap-3">
                                  <Heart className="h-5 w-5 text-brain-health mt-1 flex-shrink-0" />
                                  <div>
                                    <span className="text-sm font-medium text-brain-health">Why This Matters:</span>
                                    <p className="text-sm text-gray-700 mt-1">{action.emotional_stakes}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-2">
                              {action.status === 'pending' && (
                                <>
                                  <Button
                                    onClick={() => handleStatusUpdate(action.id, 'confirmed')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    size="sm"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Confirm Promise
                                  </Button>
                                  <Button
                                    onClick={() => handleStatusUpdate(action.id, 'rejected')}
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    size="sm"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Not Accurate
                                  </Button>
                                </>
                              )}
                              
                              {action.status === 'confirmed' && (
                                <Button
                                  onClick={() => handleStatusUpdate(action.id, 'completed')}
                                  className="bg-brain-health hover:bg-brain-health/90 text-white"
                                  size="sm"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Complete
                                </Button>
                              )}
                              
                              <div className="flex items-center text-xs text-muted-foreground ml-auto">
                                AI Confidence: {Math.round(action.confidence_score * 100)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {filteredActions.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No promises found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter settings
          </p>
        </div>
      )}
    </div>
  );
}

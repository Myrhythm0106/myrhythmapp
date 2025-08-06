
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, CheckCircle, Clock, AlertCircle, Target, Edit3, Trash2, Star } from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';
import { updateExtractedAction } from '@/utils/memoryBridgeApi';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface SeniorPACTTableProps {
  extractedActions: ExtractedAction[];
}

export function SeniorPACTTable({ extractedActions }: SeniorPACTTableProps) {
  const { user } = useAuth();
  const [actions, setActions] = useState(extractedActions);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Update local state when props change
  React.useEffect(() => {
    setActions(extractedActions);
  }, [extractedActions]);

  const handleStatusChange = async (actionId: string, newStatus: string, notes?: string) => {
    if (!user?.id) return;
    
    try {
      await updateExtractedAction(actionId, user.id, newStatus, notes);
      
      setActions(prev => 
        prev.map(action => 
          action.id === actionId 
            ? { ...action, status: newStatus as ExtractedAction['status'], user_notes: notes }
            : action
        )
      );
      
      toast.success('Action updated successfully!');
    } catch (error) {
      toast.error('Failed to update action');
      console.error('Error updating action:', error);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(actions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setActions(items);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'confirmed':
        return <Target className="h-5 w-5 text-brain-health" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'confirmed':
        return 'bg-brain-health/10 text-brain-health border-brain-health/20';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityStars = (priority: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${
          i < priority ? 'text-sunrise-amber fill-current' : 'text-gray-200'
        }`} 
      />
    ));
  };

  const filteredActions = actions.filter(action => {
    const matchesFilter = filter === 'all' || action.status === filter;
    const matchesSearch = action.action_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (action.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (actions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-brain-health/10 rounded-full flex items-center justify-center mb-4">
          <Target className="h-8 w-8 text-brain-health" />
        </div>
        <h3 className="text-xl font-semibold text-brain-health mb-2">No PACTs Found</h3>
        <p className="text-muted-foreground">
          Record a conversation to automatically extract your Promises, Actions, Commitments & Tasks
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-lg p-3"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48 text-lg p-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="pending">Need Action</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* PACT Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="actions">
            {(provided) => (
              <Table {...provided.droppableProps} ref={provided.innerRef}>
                <TableHeader>
                  <TableRow className="bg-brain-health/5">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="text-lg font-semibold">Promise/Action</TableHead>
                    <TableHead className="text-lg font-semibold">Priority</TableHead>
                    <TableHead className="text-lg font-semibold">Status</TableHead>
                    <TableHead className="text-lg font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActions.map((action, index) => (
                    <Draggable key={action.id} draggableId={action.id} index={index}>
                      {(provided, snapshot) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? 'bg-brain-health/5' : ''} hover:bg-muted/50`}
                        >
                          <TableCell {...provided.dragHandleProps} className="text-center">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </TableCell>
                          
                          <TableCell className="max-w-md">
                            <div className="space-y-2">
                              <p className="font-medium text-lg leading-relaxed">{action.action_text}</p>
                              {action.assigned_to && (
                                <Badge variant="secondary" className="text-sm">
                                  Assigned to: {action.assigned_to}
                                </Badge>
                              )}
                              {action.due_context && (
                                <p className="text-sm text-muted-foreground">Due: {action.due_context}</p>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getPriorityStars(action.priority_level)}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(action.status)}
                              <Badge className={`${getStatusColor(action.status)} text-sm font-medium`}>
                                {action.status}
                              </Badge>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex gap-2">
                              {action.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(action.id, 'confirmed')}
                                    className="text-brain-health border-brain-health/30 hover:bg-brain-health/10"
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(action.id, 'completed')}
                                    className="text-emerald-600 border-emerald-300 hover:bg-emerald/10"
                                  >
                                    Complete
                                  </Button>
                                </>
                              )}
                              
                              {action.status === 'confirmed' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusChange(action.id, 'completed')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Complete
                                </Button>
                              )}
                              
                              {action.status === 'completed' && (
                                <Badge className="bg-emerald-100 text-emerald-800 text-sm font-medium">
                                  ✓ Done
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

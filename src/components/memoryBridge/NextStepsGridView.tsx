import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Grid,
  List,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  MoreHorizontal,
  Calendar,
  Clock
} from 'lucide-react';
import { ActionStatusButton } from '@/components/actions/ActionStatusButton';
import { SimplePriorityPicker } from './SimplePriorityPicker';
import { ActionStatus } from '@/hooks/useStatusManagement';
import { Priority, numericToPriority, priorityToNumeric } from '@/types/priority';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface NextStepsItem {
  id: string;
  action_text: string;
  status: ActionStatus;
  priority_level: number;
  due_context?: string;
  proposed_date?: string;
  proposed_time?: string;
  confidence_score?: number;
  category: string;
  assigned_to?: string;
  created_at: string;
}

interface NextStepsGridViewProps {
  actions: NextStepsItem[];
  onActionUpdate: (actionId: string, updates: Partial<NextStepsItem>) => void;
  onReorder: (items: NextStepsItem[]) => void;
}

type SortField = 'action_text' | 'status' | 'priority' | 'due_date' | 'confidence' | 'created_at';
type SortDirection = 'asc' | 'desc';

export function NextStepsGridView({ 
  actions, 
  onActionUpdate, 
  onReorder 
}: NextStepsGridViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ActionStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedActions = useMemo(() => {
    let filtered = actions.filter(action => {
      const matchesSearch = action.action_text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || action.status === statusFilter;
      const actionPriority = numericToPriority(action.priority_level || 3);
      const matchesPriority = priorityFilter === 'all' || actionPriority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort actions
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'action_text':
          aValue = a.action_text.toLowerCase();
          bValue = b.action_text.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'priority':
          aValue = a.priority_level || 3;
          bValue = b.priority_level || 3;
          break;
        case 'confidence':
          aValue = a.confidence_score || 0;
          bValue = b.confidence_score || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [actions, searchTerm, statusFilter, priorityFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredAndSortedActions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const exportToCSV = () => {
    const headers = ['Action', 'Status', 'Priority', 'Due Context', 'Confidence', 'Category', 'Assigned To'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedActions.map(action => [
        `"${action.action_text.replace(/"/g, '""')}"`,
        action.status,
        numericToPriority(action.priority_level || 3),
        action.due_context || '',
        action.confidence_score || '',
        action.category,
        action.assigned_to || 'me'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `next-steps-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const GridCard = ({ action, index }: { action: NextStepsItem; index: number }) => (
    <Draggable draggableId={action.id} index={index}>
      {(provided, snapshot) => (
        <Card 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`hover:shadow-md transition-all duration-200 ${
            snapshot.isDragging ? 'rotate-2 shadow-lg scale-105' : ''
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-sm font-medium line-clamp-2">
                {action.action_text}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                  <DropdownMenuItem>Schedule</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <ActionStatusButton
                actionId={action.id}
                actionTitle={action.action_text}
                currentStatus={action.status}
                variant="badge"
                onStatusUpdated={(newStatus) => onActionUpdate(action.id, { status: newStatus })}
              />
              <Badge variant="outline" className="text-xs">
                {numericToPriority(action.priority_level || 3).toUpperCase()}
              </Badge>
            </div>
            
            {action.due_context && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {action.due_context}
              </div>
            )}
            
            {action.proposed_time && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {action.proposed_time}
              </div>
            )}
            
            {action.confidence_score && (
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${action.confidence_score}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('not_started')}>
                Ready to Begin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('doing')}>
                In My Flow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('done')}>
                Accomplished!
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="actions" direction={viewMode === 'grid' ? 'vertical' : 'vertical'}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredAndSortedActions.map((action, index) => (
                    <GridCard key={action.id} action={action} index={index} />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('action_text')}
                      >
                        <div className="flex items-center gap-1">
                          Action
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('priority')}
                      >
                        <div className="flex items-center gap-1">
                          Priority
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('confidence')}
                      >
                        <div className="flex items-center gap-1">
                          Confidence
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedActions.map((action, index) => (
                      <Draggable key={action.id} draggableId={action.id} index={index}>
                        {(provided, snapshot) => (
                          <TableRow 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`hover:bg-muted/50 transition-colors ${
                              snapshot.isDragging ? 'bg-muted shadow-lg' : ''
                            }`}
                          >
                            <TableCell className="font-medium max-w-xs">
                              <div className="line-clamp-2">{action.action_text}</div>
                            </TableCell>
                            <TableCell>
                              <ActionStatusButton
                                actionId={action.id}
                                actionTitle={action.action_text}
                                currentStatus={action.status}
                                variant="badge"
                                onStatusUpdated={(newStatus) => onActionUpdate(action.id, { status: newStatus })}
                              />
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {numericToPriority(action.priority_level || 3).toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {action.due_context || '-'}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {action.proposed_time || '-'}
                            </TableCell>
                            <TableCell>
                              {action.confidence_score && (
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-muted rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${action.confidence_score}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {action.confidence_score}%
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                  <DropdownMenuItem>Schedule</DropdownMenuItem>
                                  <DropdownMenuItem>Archive</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                  </TableBody>
                </Table>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {filteredAndSortedActions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No actions found</div>
          <div className="text-sm text-muted-foreground">
            Try adjusting your search terms or filters
          </div>
        </div>
      )}
    </div>
  );
}
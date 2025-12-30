import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GripVertical, ArrowUpDown, MoreHorizontal, Eye, MessageCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NextStepsItem } from '@/types/memoryBridge';
import { format } from 'date-fns';

interface ActionsTableViewProps {
  actions: NextStepsItem[];
  onDragEnd: (result: DropResult) => void;
  onStatusChange: (actionId: string, status: string) => void;
  onSort: (field: 'priority' | 'status' | 'date') => void;
  sortField: 'priority' | 'status' | 'date';
  sortDirection: 'asc' | 'desc';
}

const statusOptions = [
  { value: 'not_started', label: 'Ready to Begin', color: 'bg-muted text-muted-foreground' },
  { value: 'doing', label: 'In My Flow', color: 'bg-blue-100 text-blue-700' },
  { value: 'done', label: 'Accomplished!', color: 'bg-green-100 text-green-700' },
  { value: 'on_hold', label: 'Paused', color: 'bg-amber-100 text-amber-700' },
  { value: 'cancelled', label: 'Redirected', color: 'bg-red-100 text-red-700' }
];

const PriorityIndicator = ({ level }: { level: number }) => {
  const config = {
    1: { color: 'bg-red-500', glow: 'shadow-red-500/50', label: 'High' },
    2: { color: 'bg-red-500', glow: 'shadow-red-500/50', label: 'High' },
    3: { color: 'bg-brand-orange-500', glow: 'shadow-brand-orange-500/50', label: 'Medium' },
    4: { color: 'bg-green-500', glow: 'shadow-green-500/50', label: 'Low' },
    5: { color: 'bg-green-500', glow: 'shadow-green-500/50', label: 'Low' }
  }[level] || { color: 'bg-gray-400', glow: '', label: 'None' };

  return (
    <div className="flex items-center gap-2">
      <div 
        className={cn("w-3 h-3 rounded-full shadow-lg animate-pulse", config.color, config.glow)} 
        title={config.label}
      />
      <span className="text-xs text-muted-foreground">{config.label}</span>
    </div>
  );
};

const WatcherAvatars = ({ watchers }: { watchers: string[] | undefined }) => {
  if (!watchers || watchers.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="flex -space-x-1">
      {watchers.slice(0, 3).map((id, i) => (
        <Avatar key={id} className="h-6 w-6 ring-1 ring-white">
          <AvatarFallback className="text-[10px] bg-neural-purple-100 text-neural-purple-700">
            {i + 1}
          </AvatarFallback>
        </Avatar>
      ))}
      {watchers.length > 3 && (
        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium ring-1 ring-white">
          +{watchers.length - 3}
        </div>
      )}
    </div>
  );
};

export function ActionsTableView({
  actions,
  onDragEnd,
  onStatusChange,
  onSort,
  sortField,
  sortDirection
}: ActionsTableViewProps) {
  const getStatusOption = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    try {
      return format(new Date(dateStr), 'MMM d');
    } catch {
      return '—';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/40">
      {/* Glass reflection */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/50 to-transparent pointer-events-none z-10" />
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50/90 to-white/90 hover:bg-gray-50/90">
              <TableHead className="w-10"></TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors w-24"
                onClick={() => onSort('priority')}
              >
                <div className="flex items-center gap-1">
                  Priority
                  <ArrowUpDown className={cn(
                    "h-3 w-3 transition-colors",
                    sortField === 'priority' ? "text-brand-orange-500" : "text-muted-foreground"
                  )} />
                </div>
              </TableHead>
              <TableHead className="min-w-[200px]">Action</TableHead>
              <TableHead className="w-32">Assigned</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors w-24"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center gap-1">
                  Due
                  <ArrowUpDown className={cn(
                    "h-3 w-3 transition-colors",
                    sortField === 'date' ? "text-brand-orange-500" : "text-muted-foreground"
                  )} />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors w-36"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className={cn(
                    "h-3 w-3 transition-colors",
                    sortField === 'status' ? "text-brand-orange-500" : "text-muted-foreground"
                  )} />
                </div>
              </TableHead>
              <TableHead className="w-20">Watchers</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          
          <Droppable droppableId="actions-table">
            {(provided) => (
              <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                {actions.map((action, index) => (
                  <Draggable key={action.id} draggableId={action.id!} index={index}>
                    {(provided, snapshot) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "hover:bg-muted/30 transition-all duration-200",
                          snapshot.isDragging && "bg-brand-orange-50 shadow-lg scale-[1.01] rounded-lg"
                        )}
                      >
                        <TableCell 
                          {...provided.dragHandleProps} 
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </TableCell>
                        <TableCell>
                          <PriorityIndicator level={action.priority_level || 3} />
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-sm line-clamp-2">{action.action_text}</p>
                          {action.success_criteria && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              ✓ {action.success_criteria}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{action.assigned_to || 'You'}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(action.completion_date || action.end_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={action.status} 
                            onValueChange={(v) => onStatusChange(action.id!, v)}
                          >
                            <SelectTrigger className={cn(
                              "h-8 w-full text-xs border-0",
                              getStatusOption(action.status).color
                            )}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <WatcherAvatars watchers={action.assigned_watchers} />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Add Comment
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                Add to Calendar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </div>
  );
}

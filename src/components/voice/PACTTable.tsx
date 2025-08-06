import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { ExtractedAction } from '@/types/memoryBridge';
import { 
  ArrowUpDown, 
  Calendar, 
  Check, 
  CheckCircle, 
  Clock, 
  Edit, 
  Filter, 
  MoreHorizontal, 
  Star, 
  Target,
  Users,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface PACTTableProps {
  extractedActions: ExtractedAction[];
}

export function PACTTable({ extractedActions }: PACTTableProps) {
  const { confirmAction, scheduleAction } = useMemoryBridge();
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof ExtractedAction>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort actions
  const filteredAndSortedActions = useMemo(() => {
    let filtered = extractedActions.filter(action => {
      const matchesSearch = action.action_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           action.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           action.due_context?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || action.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || 
                             (priorityFilter === 'high' && action.priority_level && action.priority_level <= 2) ||
                             (priorityFilter === 'medium' && action.priority_level && action.priority_level === 3) ||
                             (priorityFilter === 'low' && action.priority_level && action.priority_level >= 4);

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [extractedActions, searchTerm, statusFilter, priorityFilter, sortField, sortDirection]);

  const handleSort = (field: keyof ExtractedAction) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAction = (actionId: string, checked: boolean) => {
    setSelectedActions(prev => 
      checked 
        ? [...prev, actionId]
        : prev.filter(id => id !== actionId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedActions(checked ? filteredAndSortedActions.map(action => action.id) : []);
  };

  const handleBatchUpdate = async (status: 'confirmed' | 'modified' | 'rejected') => {
    if (selectedActions.length === 0) {
      toast.error('No actions selected');
      return;
    }

    for (const actionId of selectedActions) {
      await confirmAction(actionId, status);
    }
    
    setSelectedActions([]);
    toast.success(`${selectedActions.length} action(s) marked as ${status}`);
  };

  const handleQuickAction = async (action: ExtractedAction, newStatus: 'confirmed' | 'modified' | 'rejected') => {
    await confirmAction(action.id, newStatus);
    toast.success(`Action ${newStatus}`);
  };

  const getPriorityIcon = (priority?: number) => {
    if (!priority) return <Clock className="h-4 w-4 text-muted-foreground" />;
    if (priority <= 2) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (priority === 3) return <Star className="h-4 w-4 text-orange-500" />;
    return <Clock className="h-4 w-4 text-green-500" />;
  };

  const getPriorityLabel = (priority?: number) => {
    if (!priority) return 'Medium';
    if (priority <= 2) return 'High';
    if (priority === 3) return 'Medium';
    return 'Low';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock },
      confirmed: { variant: 'default' as const, icon: Check },
      completed: { variant: 'default' as const, icon: CheckCircle },
      rejected: { variant: 'destructive' as const, icon: AlertCircle }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getActionTypeIcon = (type: string) => {
    const icons = {
      promise: Target,
      action: TrendingUp,
      commitment: Users,
      task: CheckCircle
    };
    const Icon = icons[type as keyof typeof icons] || Target;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2">
          <Input
            placeholder="Search PACTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Batch Actions */}
        {selectedActions.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleBatchUpdate('confirmed')}>
              Confirm ({selectedActions.length})
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBatchUpdate('modified')}>
              Modify ({selectedActions.length})
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBatchUpdate('rejected')}>
              Reject ({selectedActions.length})
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedActions.length === filteredAndSortedActions.length && filteredAndSortedActions.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('action_type')}>
                  Type <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('action_text')}>
                  PACT Description <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('priority_level')}>
                  Priority <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('assigned_to')}>
                  Assigned To <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('due_context')}>
                  Due Context <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('status')}>
                  Status <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('confidence_score')}>
                  Confidence <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedActions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {extractedActions.length === 0 
                    ? "No PACTs found. Start recording conversations to capture commitments!"
                    : "No PACTs match your current filters."
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedActions.map((action) => (
                <TableRow key={action.id} className="group hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedActions.includes(action.id)}
                      onCheckedChange={(checked) => handleSelectAction(action.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionTypeIcon(action.action_type)}
                      <span className="text-sm font-medium capitalize">{action.action_type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={action.action_text}>
                      {action.action_text}
                    </div>
                    {action.relationship_impact && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Impact: {action.relationship_impact}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getPriorityIcon(action.priority_level)}
                      <span className="text-sm">{getPriorityLabel(action.priority_level)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{action.assigned_to || 'Me'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{action.due_context || 'No deadline'}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(action.status)}
                  </TableCell>
                  <TableCell>
                    {action.confidence_score && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(action.confidence_score * 100)}%
                      </Badge>
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
                        {action.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleQuickAction(action, 'confirmed')}>
                              <Check className="mr-2 h-4 w-4" />
                              Confirm
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleQuickAction(action, 'rejected')}>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {action.status === 'confirmed' && (
                          <DropdownMenuItem onClick={() => handleQuickAction(action, 'modified')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Modify/Update
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Stats */}
      {filteredAndSortedActions.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedActions.length} of {extractedActions.length} PACTs
        </div>
      )}
    </div>
  );
}
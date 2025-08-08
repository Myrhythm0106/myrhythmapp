import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, FileDown, Printer, Target, Calendar, Clock } from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PACTLensTableProps {
  actions: ExtractedAction[];
  onUpdateAction?: (actionId: string, updates: Partial<ExtractedAction>) => void;
}

export function PACTLensTable({ actions, onUpdateAction }: PACTLensTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Generate reference numbers for actions
  const actionsWithRefs = actions.map((action, index) => ({
    ...action,
    reference_number: `PACT-${String(index + 1).padStart(3, '0')}`
  }));

  // Filter actions based on search and filters
  const filteredActions = actionsWithRefs.filter(action => {
    const matchesSearch = action.action_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.reference_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || action.action_type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || 
                           (priorityFilter === 'high' && action.priority_level >= 8) ||
                           (priorityFilter === 'medium' && action.priority_level >= 5 && action.priority_level < 8) ||
                           (priorityFilter === 'low' && action.priority_level < 5);
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const getPriorityLabel = (level: number) => {
    if (level >= 8) return 'High';
    if (level >= 5) return 'Medium';
    return 'Low';
  };

  const getPriorityColor = (level: number) => {
    if (level >= 8) return 'destructive';
    if (level >= 5) return 'secondary';
    return 'outline';
  };

  const handleTypeChange = (actionId: string, newType: string) => {
    if (onUpdateAction) {
      onUpdateAction(actionId, { action_type: newType as any });
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Reference Number', 'Priority', 'Meeting Name', 'Description', 'Date Given', 'Start Date', 'End Date', 'Watchers', 'Type'];
    const csvContent = [
      headers.join(','),
      ...filteredActions.map(action => [
        action.reference_number,
        getPriorityLabel(action.priority_level),
        'Meeting Session', // Placeholder for meeting name
        `"${action.action_text.replace(/"/g, '""')}"`,
        format(new Date(action.created_at), 'yyyy-MM-dd'),
        action.due_date ? format(new Date(action.due_date), 'yyyy-MM-dd') : '',
        action.due_date ? format(new Date(action.due_date), 'yyyy-MM-dd') : '',
        action.assigned_to || 'Self',
        action.action_type
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pact-registry-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border border-brain-health/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-brain-health">
                <Target className="h-6 w-6" />
                P.A.C.T Clinical Registry
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Promises • Agreements • Commitments • Tasks
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.print()}
                className="gap-2 text-brain-health border-brain-health/30 hover:bg-brain-health/10"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="gap-2 text-memory-emerald border-memory-emerald/30 hover:bg-memory-emerald/10"
              >
                <FileDown className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-brain-health/5 rounded-lg border border-brain-health/10">
              <div className="text-2xl font-bold text-brain-health">{actions.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center p-4 bg-memory-emerald/5 rounded-lg border border-memory-emerald/10">
              <div className="text-2xl font-bold text-memory-emerald">
                {actions.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 bg-sunrise-amber/5 rounded-lg border border-sunrise-amber/10">
              <div className="text-2xl font-bold text-sunrise-amber">
                {actions.filter(a => a.status === 'pending' || a.status === 'confirmed').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center p-4 bg-clarity-teal/5 rounded-lg border border-clarity-teal/10">
              <div className="text-2xl font-bold text-clarity-teal">
                {actions.length > 0 ? Math.round((actions.filter(a => a.status === 'completed').length / actions.length) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Compliance</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="promise">Promise</SelectItem>
                <SelectItem value="commitment">Agreement</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="reminder">Communication</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* PACT Table */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-brain-health">Reference #</TableHead>
                <TableHead className="font-semibold text-brain-health">Priority</TableHead>
                <TableHead className="font-semibold text-brain-health">Meeting Name</TableHead>
                <TableHead className="font-semibold text-brain-health">Description</TableHead>
                <TableHead className="font-semibold text-brain-health">Date Given</TableHead>
                <TableHead className="font-semibold text-brain-health">Start Date</TableHead>
                <TableHead className="font-semibold text-brain-health">End Date</TableHead>
                <TableHead className="font-semibold text-brain-health">Watcher(s)</TableHead>
                <TableHead className="font-semibold text-brain-health">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActions.map((action) => (
                <TableRow key={action.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-mono text-sm text-brain-health font-medium">
                    {action.reference_number}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getPriorityColor(action.priority_level)}
                      className={cn(
                        "font-medium",
                        action.priority_level >= 8 && "bg-red-50 text-red-700 border-red-200",
                        action.priority_level >= 5 && action.priority_level < 8 && "bg-orange-50 text-orange-700 border-orange-200",
                        action.priority_level < 5 && "bg-green-50 text-green-700 border-green-200"
                      )}
                    >
                      {getPriorityLabel(action.priority_level)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    Clinical Session
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate text-sm text-gray-900" title={action.action_text}>
                      {action.action_text}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {format(new Date(action.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {action.due_date ? format(new Date(action.due_date), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {action.due_date ? format(new Date(action.due_date), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {action.assigned_to || 'Self'}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={action.action_type} 
                      onValueChange={(value) => handleTypeChange(action.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promise">Promise</SelectItem>
                        <SelectItem value="commitment">Agreement</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="reminder">Communication</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredActions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 text-brain-health/30" />
              <p className="font-medium">No P.A.C.T items found</p>
              <p className="text-sm mt-1">
                {searchTerm || typeFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Start recording sessions to populate the registry'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
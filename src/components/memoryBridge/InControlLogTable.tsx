import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, FileDown, Printer, Target, Calendar, ChevronDown, ChevronRight, Users } from 'lucide-react';
import { InControlItem } from '@/types/memoryBridge';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface InControlLogTableProps {
  items: InControlItem[];
  onUpdateItem?: (itemId: string, updates: Partial<InControlItem>) => void;
}

interface MeetingGroup {
  meetingId: string;
  meetingTitle: string;
  date: string;
  items: (InControlItem & { reference_number: string })[];
  isOpen: boolean;
}

export function InControlLogTable({ items, onUpdateItem }: InControlLogTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [openMeetings, setOpenMeetings] = useState<Set<string>>(new Set());

  // Generate reference numbers and group by meeting
  const itemsWithRefs = items.map((item, index) => ({
    ...item,
    reference_number: `CTRL-${String(index + 1).padStart(3, '0')}`
  }));

  // Group items by meeting
  const meetingGroups: MeetingGroup[] = React.useMemo(() => {
    const grouped = itemsWithRefs.reduce((acc, item) => {
      const meetingId = item.meeting_recording_id;
      if (!acc[meetingId]) {
        acc[meetingId] = {
          meetingId,
          meetingTitle: `InControl Session ${format(parseISO(item.created_at), 'MMM d')}`,
          date: item.created_at,
          items: [],
          isOpen: true
        };
      }
      acc[meetingId].items.push(item);
      return acc;
    }, {} as Record<string, MeetingGroup>);

    return Object.values(grouped).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [itemsWithRefs]);

  // Filter items
  const filteredGroups = meetingGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      const matchesSearch = item.action_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.reference_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || 
                             (priorityFilter === 'high' && item.priority_level >= 8) ||
                             (priorityFilter === 'medium' && item.priority_level >= 5 && item.priority_level < 8) ||
                             (priorityFilter === 'low' && item.priority_level < 5);
      
      return matchesSearch && matchesPriority;
    })
  })).filter(group => group.items.length > 0);

  const toggleMeeting = (meetingId: string) => {
    const newOpen = new Set(openMeetings);
    if (newOpen.has(meetingId)) {
      newOpen.delete(meetingId);
    } else {
      newOpen.add(meetingId);
    }
    setOpenMeetings(newOpen);
  };

  const getPriorityLabel = (level: number) => {
    if (level >= 8) return 'High';
    if (level >= 5) return 'Medium';
    return 'Low';
  };

  const getPriorityColor = (level: number) => {
    if (level >= 8) return 'bg-red-50 text-red-700 border-red-200';
    if (level >= 5) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getActionTypeLabel = (type: string) => {
    const typeMap = {
      'intention': 'Intention',
      'next_step': 'Next Step',
      'commitment': 'Commitment',
      'outcome': 'Outcome',
      'note': 'Note',
      'timeline': 'Timeline',
      'resource': 'Resource',
      'obstacle': 'Obstacle',
      'learning': 'Learning'
    };
    return typeMap[type] || type;
  };

  const handleExport = () => {
    const allItems = filteredGroups.flatMap(group => group.items);
    const headers = ['Reference', 'Date', 'Meeting Title', 'Description', 'Priority', 'Support Circle', 'Type'];
    const csvContent = [
      headers.join(','),
      ...allItems.map(item => [
        item.reference_number,
        format(parseISO(item.created_at), 'yyyy-MM-dd'),
        `"InControl Session ${format(parseISO(item.created_at), 'MMM d')}"`,
        `"${item.action_text.replace(/"/g, '""')}"`,
        getPriorityLabel(item.priority_level),
        `"${(item.support_circle || []).join(', ')}"`,
        getActionTypeLabel(item.action_type)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incontrol-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalItems = items.length;
  const completedItems = items.filter(item => item.status === 'completed').length;
  const activeItems = items.filter(item => item.status === 'pending' || item.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border border-[hsl(var(--brain-health))]/20 bg-gradient-to-r from-[hsl(var(--memory-emerald))]/5 to-[hsl(var(--brain-health))]/5">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--brain-health))]">
                <Target className="h-6 w-6" />
                InControl Log
              </CardTitle>
              <p className="text-[hsl(var(--muted-foreground))] mt-1">
                Complete Life Management System
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.print()}
                className="gap-2 text-[hsl(var(--brain-health))] border-[hsl(var(--brain-health))]/30 hover:bg-[hsl(var(--brain-health))]/10"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="gap-2 text-[hsl(var(--memory-emerald))] border-[hsl(var(--memory-emerald))]/30 hover:bg-[hsl(var(--memory-emerald))]/10"
              >
                <FileDown className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-[hsl(var(--brain-health))]/5 rounded-lg border border-[hsl(var(--brain-health))]/10">
              <div className="text-2xl font-bold text-[hsl(var(--brain-health))]">{totalItems}</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">Total Items</div>
            </div>
            <div className="text-center p-4 bg-[hsl(var(--memory-emerald))]/5 rounded-lg border border-[hsl(var(--memory-emerald))]/10">
              <div className="text-2xl font-bold text-[hsl(var(--memory-emerald))]">{completedItems}</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">Completed</div>
            </div>
            <div className="text-center p-4 bg-[hsl(var(--sunrise-amber))]/5 rounded-lg border border-[hsl(var(--sunrise-amber))]/10">
              <div className="text-2xl font-bold text-[hsl(var(--sunrise-amber))]">{activeItems}</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">Active</div>
            </div>
            <div className="text-center p-4 bg-[hsl(var(--clarity-teal))]/5 rounded-lg border border-[hsl(var(--clarity-teal))]/10">
              <div className="text-2xl font-bold text-[hsl(var(--clarity-teal))]">
                {totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}%
              </div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">Progress</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <Input
                placeholder="Search by reference or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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

      {/* InControl Table with Collapsible Meetings */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
              <Target className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--brain-health))]/30" />
              <p className="font-medium">No InControl items found</p>
              <p className="text-sm mt-1">
                {searchTerm || priorityFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Start recording sessions to populate your InControl Log'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredGroups.map((group) => (
                <div key={group.meetingId}>
                  {/* Meeting Header */}
                  <Collapsible 
                    open={openMeetings.has(group.meetingId)} 
                    onOpenChange={() => toggleMeeting(group.meetingId)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 hover:bg-gray-50/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          {openMeetings.has(group.meetingId) ? (
                            <ChevronDown className="h-5 w-5 text-[hsl(var(--brain-health))]" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-[hsl(var(--brain-health))]" />
                          )}
                          <div>
                            <h3 className="font-semibold text-[hsl(var(--brain-health))]">{group.meetingTitle}</h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                              {format(parseISO(group.date), 'MMMM d, yyyy')} • {group.items.length} items
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[hsl(var(--brain-health))]">
                          {group.items.length} items
                        </Badge>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/50">
                            <TableHead className="font-semibold text-[hsl(var(--brain-health))]">Reference</TableHead>
                            <TableHead className="font-semibold text-[hsl(var(--brain-health))]">Priority</TableHead>
                            <TableHead className="font-semibold text-[hsl(var(--brain-health))]">Description</TableHead>
                            <TableHead className="font-semibold text-[hsl(var(--brain-health))]">Support Circle</TableHead>
                            <TableHead className="font-semibold text-[hsl(var(--brain-health))]">Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50/50">
                              <TableCell className="font-mono text-sm text-[hsl(var(--brain-health))] font-medium">
                                {item.reference_number}
                              </TableCell>
                              <TableCell>
                                <Badge className={cn("font-medium border", getPriorityColor(item.priority_level))}>
                                  {getPriorityLabel(item.priority_level)}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-md">
                                <div className="truncate text-sm" title={item.action_text}>
                                  {item.action_text}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <Users className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                                  {item.support_circle && item.support_circle.length > 0 
                                    ? item.support_circle.join(', ')
                                    : item.assigned_to || 'Self'
                                  }
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {getActionTypeLabel(item.action_type)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
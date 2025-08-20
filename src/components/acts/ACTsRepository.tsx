import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit,
  Archive
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ACTsItem {
  id: string;
  action: string;
  context: string;
  timeframe: string;
  support: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  meetingId?: string;
  meetingTitle?: string;
  dueDate?: string;
  scheduledDate?: string;
  createdAt: string;
  completedAt?: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  actsCount: number;
  completedCount: number;
}

const mockACTs: ACTsItem[] = [
  {
    id: 'act-1',
    action: 'Schedule follow-up appointment with Dr. Smith',
    context: 'Discussed new treatment options and need follow-up in 2 weeks',
    timeframe: 'Within 2 weeks',
    support: 'None required',
    priority: 'high',
    status: 'pending',
    meetingId: 'meeting-1',
    meetingTitle: 'Dr. Smith Consultation',
    dueDate: '2024-09-05',
    createdAt: '2024-08-22T10:30:00Z'
  },
  {
    id: 'act-2',
    action: 'Pick up new prescription',
    context: 'New medication prescribed during appointment',
    timeframe: 'Tomorrow',
    support: 'Ask partner to drive if needed',
    priority: 'medium',
    status: 'completed',
    meetingId: 'meeting-1',
    meetingTitle: 'Dr. Smith Consultation',
    dueDate: '2024-08-23',
    completedAt: '2024-08-23T14:00:00Z',
    createdAt: '2024-08-22T10:30:00Z'
  },
  {
    id: 'act-3',
    action: 'Call insurance about coverage',
    context: 'Need to verify coverage for new treatment',
    timeframe: 'This week',
    support: 'Have policy number ready',
    priority: 'medium',
    status: 'in-progress',
    meetingId: 'meeting-2',
    meetingTitle: 'Weekly Planning Session',
    dueDate: '2024-08-30',
    createdAt: '2024-08-20T09:00:00Z'
  }
];

const mockMeetings: Meeting[] = [
  {
    id: 'meeting-1',
    title: 'Dr. Smith Consultation',
    date: '2024-08-22',
    actsCount: 2,
    completedCount: 1
  },
  {
    id: 'meeting-2',
    title: 'Weekly Planning Session',
    date: '2024-08-20',
    actsCount: 1,
    completedCount: 0
  }
];

export function ACTsRepository() {
  const [acts, setActs] = useState<ACTsItem[]>(mockACTs);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [groupBy, setGroupBy] = useState<'meeting' | 'priority' | 'date'>('meeting');
  const [expandedMeetings, setExpandedMeetings] = useState<string[]>(['meeting-1']);

  const filteredACTs = acts.filter(act => {
    const matchesSearch = act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         act.context.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || act.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || act.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const toggleMeeting = (meetingId: string) => {
    setExpandedMeetings(prev => 
      prev.includes(meetingId) 
        ? prev.filter(id => id !== meetingId)
        : [...prev, meetingId]
    );
  };

  const toggleACTStatus = (actId: string) => {
    setActs(prev => prev.map(act => 
      act.id === actId 
        ? { 
            ...act, 
            status: act.status === 'completed' ? 'pending' : 'completed',
            completedAt: act.status === 'completed' ? undefined : new Date().toISOString()
          }
        : act
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-sunrise-amber-600 bg-sunrise-amber-50 border-sunrise-amber-200';
      case 'low': return 'text-memory-emerald-600 bg-memory-emerald-50 border-memory-emerald-200';
      default: return 'text-brain-health-600 bg-brain-health-50 border-brain-health-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-memory-emerald-600 bg-memory-emerald-50 border-memory-emerald-200';
      case 'in-progress': return 'text-clarity-teal-600 bg-clarity-teal-50 border-clarity-teal-200';
      case 'pending': return 'text-sunrise-amber-600 bg-sunrise-amber-50 border-sunrise-amber-200';
      case 'archived': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-brain-health-600 bg-brain-health-50 border-brain-health-200';
    }
  };

  const renderACTCard = (act: ACTsItem) => (
    <Card key={act.id} className="border-brain-health-100 hover:border-brain-health-200 transition-colors">
      <CardContent className="p-4 space-y-3">
        {/* Header with action and status */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleACTStatus(act.id)}
                className="p-1 h-auto"
              >
                {act.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-memory-emerald-500" />
                ) : (
                  <div className="h-5 w-5 border-2 border-brain-health-300 rounded-full" />
                )}
              </Button>
              <h4 className={`font-medium ${act.status === 'completed' ? 'line-through text-brain-health-500' : 'text-brain-health-800'}`}>
                {act.action}
              </h4>
            </div>
            
            <p className="text-sm text-brain-health-600 ml-7">
              {act.context}
            </p>
          </div>
          
          <div className="flex flex-col space-y-1">
            <Badge className={`text-xs px-2 py-1 ${getPriorityColor(act.priority)}`}>
              {act.priority}
            </Badge>
            <Badge className={`text-xs px-2 py-1 ${getStatusColor(act.status)}`}>
              {act.status}
            </Badge>
          </div>
        </div>
        
        {/* Details */}
        <div className="ml-7 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-sunrise-amber-500" />
              <span className="text-brain-health-600">
                <strong>Timeframe:</strong> {act.timeframe}
              </span>
            </div>
            
            {act.support && act.support !== 'None required' && (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-clarity-teal-500" />
                <span className="text-brain-health-600">
                  <strong>Support:</strong> {act.support}
                </span>
              </div>
            )}
            
            {act.dueDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-brain-health-500" />
                <span className="text-brain-health-600">
                  <strong>Due:</strong> {new Date(act.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-2 pt-2">
            <Button size="sm" variant="outline" className="text-xs h-7">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-7">
              <Calendar className="h-3 w-3 mr-1" />
              Schedule
            </Button>
            {act.status !== 'archived' && (
              <Button size="sm" variant="outline" className="text-xs h-7">
                <Archive className="h-3 w-3 mr-1" />
                Archive
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brain-health-900">ACTS Repository</h2>
          <p className="text-brain-health-600">
            Your central hub for Actions, Context, Timeframe & Support tracking
          </p>
        </div>
        
        <Button className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add ACTS
        </Button>
      </div>
      
      {/* Filters and Search */}
      <Card className="border-brain-health-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brain-health-400" />
              <Input
                placeholder="Search ACTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">By Meeting</SelectItem>
                <SelectItem value="priority">By Priority</SelectItem>
                <SelectItem value="date">By Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50/50 to-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-memory-emerald-600">
              {filteredACTs.length}
            </div>
            <div className="text-sm text-memory-emerald-700">Total ACTS</div>
          </CardContent>
        </Card>
        
        <Card className="border-sunrise-amber-200 bg-gradient-to-r from-sunrise-amber-50/50 to-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sunrise-amber-600">
              {filteredACTs.filter(act => act.status === 'pending').length}
            </div>
            <div className="text-sm text-sunrise-amber-700">Pending</div>
          </CardContent>
        </Card>
        
        <Card className="border-clarity-teal-200 bg-gradient-to-r from-clarity-teal-50/50 to-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-clarity-teal-600">
              {filteredACTs.filter(act => act.status === 'in-progress').length}
            </div>
            <div className="text-sm text-clarity-teal-700">In Progress</div>
          </CardContent>
        </Card>
        
        <Card className="border-brain-health-200 bg-gradient-to-r from-brain-health-50/50 to-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brain-health-600">
              {filteredACTs.filter(act => act.status === 'completed').length}
            </div>
            <div className="text-sm text-brain-health-700">Completed</div>
          </CardContent>
        </Card>
      </div>
      
      {/* ACTS List - Grouped by Meeting */}
      {groupBy === 'meeting' && (
        <div className="space-y-4">
          {meetings.map(meeting => {
            const meetingACTs = filteredACTs.filter(act => act.meetingId === meeting.id);
            const isExpanded = expandedMeetings.includes(meeting.id);
            
            if (meetingACTs.length === 0) return null;
            
            return (
              <Card key={meeting.id} className="border-brain-health-200">
                <Collapsible open={isExpanded} onOpenChange={() => toggleMeeting(meeting.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-brain-health-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-brain-health-600" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-brain-health-600" />
                          )}
                          <div>
                            <CardTitle className="text-lg text-brain-health-800">
                              {meeting.title}
                            </CardTitle>
                            <p className="text-sm text-brain-health-600">
                              {new Date(meeting.date).toLocaleDateString()} • {meetingACTs.length} ACTS
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-brain-health-100 text-brain-health-700">
                            {meetingACTs.filter(act => act.status === 'completed').length}/{meetingACTs.length} Complete
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      {meetingACTs.map(renderACTCard)}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
          
          {/* Orphaned ACTS (no meeting) */}
          {filteredACTs.filter(act => !act.meetingId).length > 0 && (
            <Card className="border-brain-health-200">
              <CardHeader>
                <CardTitle className="text-lg text-brain-health-800">
                  Individual ACTS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredACTs.filter(act => !act.meetingId).map(renderACTCard)}
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Simple list view for other groupings */}
      {groupBy !== 'meeting' && (
        <div className="space-y-3">
          {filteredACTs.map(renderACTCard)}
        </div>
      )}
      
      {filteredACTs.length === 0 && (
        <Card className="border-brain-health-200">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-brain-health-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brain-health-700 mb-2">
              No ACTS found
            </h3>
            <p className="text-brain-health-600 mb-4">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Start by capturing a conversation or adding your first ACTS item.'
              }
            </p>
            <Button className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First ACTS
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
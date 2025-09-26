import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  ListTodo, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  Heart,
  HelpCircle,
  Calendar,
  Filter
} from 'lucide-react';
import { useSupportMemberActions } from '@/hooks/use-support-member-actions';
import { toast } from 'sonner';

export function SupportMemberDashboard() {
  const { actions, notes, isLoading, supportedUsers, updateActionStatus, addSupportNote } = useSupportMemberActions();
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<'encouragement' | 'reminder' | 'help_offer' | 'status_update'>('encouragement');
  const [selectedActionForNote, setSelectedActionForNote] = useState<string | null>(null);

  const filteredActions = actions.filter(action => {
    if (selectedUser !== 'all' && action.user_id !== selectedUser) return false;
    if (statusFilter !== 'all' && action.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && action.priority_level.toString() !== priorityFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'doing': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-orange-100 text-orange-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      default: return 'Low';
    }
  };

  const handleStatusUpdate = async (actionId: string, status: string) => {
    const success = await updateActionStatus(actionId, status);
    if (success) {
      toast.success('Action status updated successfully');
    } else {
      toast.error('Failed to update action status');
    }
  };

  const handleAddNote = async () => {
    if (!selectedActionForNote || !noteText.trim()) return;

    const success = await addSupportNote(selectedActionForNote, noteText, noteType);
    if (success) {
      toast.success('Support note added successfully');
      setNoteText('');
      setSelectedActionForNote(null);
    } else {
      toast.error('Failed to add support note');
    }
  };

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case 'encouragement': return <Heart className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'help_offer': return <HelpCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalActions = filteredActions.length;
  const completedActions = filteredActions.filter(a => a.status === 'done').length;
  const activeActions = filteredActions.filter(a => ['not_started', 'doing'].includes(a.status)).length;
  const highPriorityActions = filteredActions.filter(a => a.priority_level === 1).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Support Circle Dashboard</h1>
            <p className="text-muted-foreground">
              Help the people you care about achieve their goals
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Users className="h-4 w-4 mr-2" />
            Supporting {supportedUsers.length} {supportedUsers.length === 1 ? 'person' : 'people'}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <ListTodo className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Actions</p>
                  <p className="text-2xl font-bold">{totalActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{activeActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold">{highPriorityActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="All People" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All People</SelectItem>
                  {supportedUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="doing">In Progress</SelectItem>
                  <SelectItem value="done">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="1">High Priority</SelectItem>
                  <SelectItem value="2">Medium Priority</SelectItem>
                  <SelectItem value="3">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions List */}
        <div className="space-y-4">
          {filteredActions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">No actions found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or check back later for new action items.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredActions.map((action) => (
              <Card key={action.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getStatusColor(action.status)}>
                          {action.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(action.priority_level)}>
                          {getPriorityLabel(action.priority_level)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {action.user_name}
                        </span>
                        {action.meeting_title && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {action.meeting_title}
                          </span>
                        )}
                      </div>
                      <p className="font-medium mb-2">{action.action_text}</p>
                      {action.due_context && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {action.due_context}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(action.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Select 
                        value={action.status} 
                        onValueChange={(status) => handleStatusUpdate(action.id, status)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">Not Started</SelectItem>
                          <SelectItem value="doing">In Progress</SelectItem>
                          <SelectItem value="done">Completed</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedActionForNote(action.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Note
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Support Note</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="font-medium mb-2">Action:</p>
                              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                                {action.action_text}
                              </p>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Note Type</label>
                              <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="encouragement">Encouragement</SelectItem>
                                  <SelectItem value="reminder">Gentle Reminder</SelectItem>
                                  <SelectItem value="help_offer">Offer to Help</SelectItem>
                                  <SelectItem value="status_update">Status Update</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="text-sm font-medium">Message</label>
                              <Textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Write an encouraging message..."
                                rows={3}
                              />
                            </div>

                            <Button onClick={handleAddNote} className="w-full">
                              {getNoteTypeIcon(noteType)}
                              <span className="ml-2">Send Support Message</span>
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
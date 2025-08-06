import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemoryBridge } from '@/hooks/useMemoryBridge';
import { useSupportCircle } from '@/hooks/use-support-circle';
import { formatDistanceToNow } from 'date-fns';
import { 
  Target, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Clock, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Share,
  ChevronRight,
  Brain,
  Zap,
  Star,
  Send,
  Eye,
  Edit3
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from '@/hooks/useRouter';

interface ActionComment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  authorRole: 'user' | 'supporter';
}

export function InteractivePACTReports() {
  const { 
    extractedActions, 
    meetingRecordings, 
    scheduleAction 
  } = useMemoryBridge();
  const { members } = useSupportCircle();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [actionComments, setActionComments] = useState<Record<string, ActionComment[]>>({});
  const [newComment, setNewComment] = useState('');
  const [assignedMembers, setAssignedMembers] = useState<Record<string, string[]>>({});
  const [showCommentDialog, setShowCommentDialog] = useState(false);

  // Group actions by meeting/date for reports
  const reportGroups = meetingRecordings.map(meeting => {
    const meetingActions = extractedActions.filter(
      action => action.meeting_recording_id === meeting.id
    );
    return {
      meeting,
      actions: meetingActions,
      totalActions: meetingActions.length,
      completedActions: meetingActions.filter(a => a.status === 'completed').length,
      pendingActions: meetingActions.filter(a => a.status === 'pending').length,
      trustScore: meetingActions.length > 0 
        ? Math.round((meetingActions.filter(a => a.status === 'completed').length / meetingActions.length) * 100)
        : 100
    };
  }).filter(group => group.totalActions > 0);

  const filteredReports = reportGroups.filter(group =>
    group.meeting.meeting_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.meeting.meeting_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGoToCalendar = (actionId: string, date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    router.navigate(`/calendar?date=${targetDate}&action=${actionId}`);
  };

  const handleAssignToSupportCircle = (actionId: string, memberIds: string[]) => {
    setAssignedMembers(prev => ({
      ...prev,
      [actionId]: memberIds
    }));
    toast.success('Action assigned to support circle members');
  };

  const handleAddComment = () => {
    if (!selectedAction || !newComment.trim()) return;

    const comment: ActionComment = {
      id: crypto.randomUUID(),
      author: 'You',
      content: newComment,
      timestamp: new Date(),
      authorRole: 'user'
    };

    setActionComments(prev => ({
      ...prev,
      [selectedAction]: [...(prev[selectedAction] || []), comment]
    }));

    setNewComment('');
    setShowCommentDialog(false);
    toast.success('Comment added');
  };

  const renderActionCard = (action: any, reportGroup: any) => {
    const comments = actionComments[action.id] || [];
    const assigned = assignedMembers[action.id] || [];
    const assignedMembers_details = members.filter(m => assigned.includes(m.id));

    return (
      <Card key={action.id} className="border border-brain-health/20 bg-gradient-to-r from-white via-brain-health/5 to-memory-emerald/5">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Action Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-lg">{action.action_text}</h4>
                  <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                    {action.status}
                  </Badge>
                  <Badge variant="outline">{action.action_type}</Badge>
                </div>
                
                {action.due_context && (
                  <p className="text-sm text-muted-foreground mb-2">Due: {action.due_context}</p>
                )}
                
                {action.relationship_impact && (
                  <p className="text-sm text-brain-health mb-2">
                    <strong>Relationship Impact:</strong> {action.relationship_impact}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Priority: {action.priority_level}/10
                </span>
                <div className={`w-3 h-3 rounded-full ${
                  action.priority_level >= 8 ? 'bg-red-500' :
                  action.priority_level >= 6 ? 'bg-orange-500' : 'bg-green-500'
                }`} />
              </div>
            </div>

            {/* Assigned Support Circle */}
            {assignedMembers_details.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Watching:</span>
                <div className="flex items-center gap-2">
                  {assignedMembers_details.map(member => (
                    <div key={member.id} className="flex items-center gap-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Preview */}
            {comments.length > 0 && (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-brain-health" />
                  <span className="text-sm font-medium">{comments.length} comment(s)</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Latest: "{comments[comments.length - 1].content.substring(0, 50)}..."
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGoToCalendar(action.id, reportGroup.meeting.created_at?.split('T')[0])}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Go to Calendar
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Assign Watchers
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Support Circle Members</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select who should be notified about this action's progress:
                    </p>
                    <div className="space-y-2">
                      {members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">Family Member</div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={assigned.includes(member.id) ? "default" : "outline"}
                            onClick={() => {
                              const newAssigned = assigned.includes(member.id)
                                ? assigned.filter(id => id !== member.id)
                                : [...assigned, member.id];
                              handleAssignToSupportCircle(action.id, newAssigned);
                            }}
                          >
                            {assigned.includes(member.id) ? "Remove" : "Add"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedAction(action.id);
                  setShowCommentDialog(true);
                }}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (selectedReport) {
    const reportGroup = reportGroups.find(g => g.meeting.id === selectedReport);
    if (!reportGroup) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedReport(null)}
            className="flex items-center gap-2"
          >
            ← Back to Reports
          </Button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-brain-health to-emerald-600 bg-clip-text text-transparent">
            Interactive PACT Report
          </h2>
        </div>
        
        {/* Meeting Info */}
        <Card className="border-2 border-brain-health/40 bg-gradient-trust">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="w-6 h-6 text-brain-health" />
              {reportGroup.meeting.meeting_title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formatDistanceToNow(new Date(reportGroup.meeting.created_at), { addSuffix: true })}</span>
              <Badge variant="outline">{reportGroup.meeting.meeting_type}</Badge>
              <Badge variant={reportGroup.trustScore >= 80 ? "default" : "secondary"}>
                {reportGroup.trustScore}% Trust Score
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          {reportGroup.actions.map(action => renderActionCard(action, reportGroup))}
        </div>

        {/* Comment Dialog */}
        <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Status Comment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedAction && actionComments[selectedAction]?.map(comment => (
                <div key={comment.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
              
              <Textarea
                placeholder="Add your status update or comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-brain-health/40 bg-gradient-to-br from-brain-health/10 via-emerald/5 to-clarity-teal/10 shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <Target className="w-8 h-8 text-brain-health" />
            <span className="bg-gradient-to-r from-brain-health to-emerald-600 bg-clip-text text-transparent">
              Interactive PACT Reports
            </span>
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            📊 Promises • Actions • Commitments • Tasks | Click-through to Calendar & Support Circle Integration
          </p>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-brain-health/10 border border-brain-health/20">
              <div className="text-3xl font-bold text-brain-health">{reportGroups.length}</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-emerald/10 border border-emerald/20">
              <div className="text-3xl font-bold text-emerald-600">
                {reportGroups.reduce((sum, group) => sum + group.completedActions, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Completed Actions</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-clarity-teal/10 border border-clarity-teal/20">
              <div className="text-3xl font-bold text-clarity-teal-600">
                {reportGroups.reduce((sum, group) => sum + group.pendingActions, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Pending Actions</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-sunrise-amber/10 border border-sunrise-amber/20">
              <div className="text-3xl font-bold text-sunrise-amber-600">
                {reportGroups.length > 0 
                  ? Math.round(reportGroups.reduce((sum, group) => sum + group.trustScore, 0) / reportGroups.length)
                  : 100}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Trust Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PACT reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Target className="h-16 w-16 mx-auto mb-4 text-brain-health/50" />
                <h3 className="text-lg font-semibold mb-2">No PACT Reports Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Record conversations to generate actionable PACT reports
                </p>
                <Button className="bg-gradient-to-r from-brain-health to-emerald-500 text-white">
                  <Brain className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredReports.map((reportGroup) => (
          <Card 
            key={reportGroup.meeting.id} 
            className="border border-brain-health/20 hover:border-brain-health/40 transition-all hover:shadow-md cursor-pointer"
            onClick={() => setSelectedReport(reportGroup.meeting.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{reportGroup.meeting.meeting_title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {reportGroup.meeting.meeting_type}
                    </Badge>
                    <Badge 
                      variant={reportGroup.trustScore >= 80 ? "default" : reportGroup.trustScore >= 60 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {reportGroup.trustScore}% Trust
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600">
                      Interactive
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(reportGroup.meeting.created_at), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {reportGroup.totalActions} actions
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      {reportGroup.completedActions} completed
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-orange-500" />
                      {reportGroup.pendingActions} pending
                    </div>
                  </div>

                  {/* Preview of top actions */}
                  <div className="space-y-2">
                    {reportGroup.actions.slice(0, 2).map((action) => (
                      <div key={action.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
                        <div className={`w-2 h-2 rounded-full ${
                          action.status === 'completed' ? 'bg-emerald-500' : 
                          action.status === 'pending' ? 'bg-orange-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm text-muted-foreground truncate">
                          {action.action_text}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {action.action_type}
                        </Badge>
                      </div>
                    ))}
                    {reportGroup.actions.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{reportGroup.actions.length - 2} more actions... Click to interact
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <Share className="h-4 w-4" />
                  </Button>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
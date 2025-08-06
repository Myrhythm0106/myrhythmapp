import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfessionalPactReport } from './ProfessionalPactReport';
import { ScheduleActionDialog, ScheduleData } from './ScheduleActionDialog';
import { useMemoryBridge } from '@/hooks/useMemoryBridge';
import { formatDistanceToNow } from 'date-fns';
import { 
  Target, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Share,
  ChevronRight,
  Brain,
  Zap,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

export function PACTReportsHub() {
  const { 
    extractedActions, 
    meetingRecordings, 
    scheduleAction 
  } = useMemoryBridge();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedActionForScheduling, setSelectedActionForScheduling] = useState(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

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

  const handleScheduleAction = (action: any) => {
    setSelectedActionForScheduling(action);
    setShowScheduleDialog(true);
  };

  const handleScheduleSubmit = async (actionId: string, scheduleData: ScheduleData) => {
    await scheduleAction(actionId, scheduleData);
    setShowScheduleDialog(false);
    setSelectedActionForScheduling(null);
    toast.success('Action scheduled successfully!');
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (selectedReport) {
    const reportGroup = reportGroups.find(g => g.meeting.id === selectedReport);
    if (reportGroup) {
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
              PACT Report Details
            </h2>
          </div>
          
          <ProfessionalPactReport
            actions={reportGroup.actions}
            meetingTitle={reportGroup.meeting.meeting_title}
            meetingDate={reportGroup.meeting.created_at}
            onScheduleAction={handleScheduleAction}
            onExportPDF={handleExportPDF}
          />

          {showScheduleDialog && selectedActionForScheduling && (
            <ScheduleActionDialog
              action={selectedActionForScheduling}
              isOpen={showScheduleDialog}
              onClose={() => setShowScheduleDialog(false)}
              onSchedule={handleScheduleSubmit}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-brain-health/40 bg-gradient-to-br from-brain-health/10 via-emerald/5 to-clarity-teal/10 shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <Target className="w-8 h-8 text-brain-health" />
            <span className="bg-gradient-to-r from-brain-health to-emerald-600 bg-clip-text text-transparent">
              My PACT Reports
            </span>
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            📊 Promises • Actions • Commitments • Tasks | Interactive Trust Building Dashboard
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
                        +{reportGroup.actions.length - 2} more actions...
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
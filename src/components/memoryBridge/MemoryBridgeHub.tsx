import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SeniorMemoryBridge } from './SeniorMemoryBridge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UnifiedMemoryFlow } from './UnifiedMemoryFlow';
import { CalendarView } from '@/components/calendar/CalendarView';
import { ExtractedActionsReview } from './ExtractedActionsReview';
import { InteractivePACTReports } from './InteractivePACTReports';
import { CodeWordSettings } from './CodeWordSettings';
import { ProfessionalPactReport } from './ProfessionalPactReport';
import { PACTLensTable } from './PACTLensTable';
import { ScheduleActionDialog, ScheduleData } from './ScheduleActionDialog';
import { useMemoryBridge } from '@/hooks/useMemoryBridge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { RecordingUsageTracker } from './RecordingUsageTracker';
import { formatDistanceToNow } from 'date-fns';
import { 
  Brain, 
  Mic, 
  Play, 
  Pause, 
  Clock, 
  Calendar,
  Settings, 
  Heart, 
  Zap, 
  Trophy,
  Target,
  Users,
  Shield,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Download,
  Share,
  Archive,
  Search,
  Filter,
  Volume2,
  ChevronRight,
  Award,
  Flame,
  Crown,
  Sparkles
} from 'lucide-react';
import { MeetingRecording } from '@/types/memoryBridge';
import { toast } from 'sonner';

interface RecordingSettings {
  autoRecord: boolean;
  retentionDays: number;
  enableAmbientMode: boolean;
  qualityLevel: 'standard' | 'high' | 'clinical';
  shareWithFamily: boolean;
  enableTranscription: boolean;
}

export function MemoryBridgeHub() {
  const { 
    extractedActions, 
    meetingRecordings,
    activeMeeting,
    loading,
    scheduleAction
  } = useMemoryBridge();
  
  const { tier } = useSubscription();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSeniorMode, setIsSeniorMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionForScheduling, setSelectedActionForScheduling] = useState(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showPACTGeneration, setShowPACTGeneration] = useState(false);
  const [settings, setSettings] = useState<RecordingSettings>({
    autoRecord: false,
    retentionDays: 30,
    enableAmbientMode: false,
    qualityLevel: 'high',
    shareWithFamily: true,
    enableTranscription: true
  });

  // Calculate trust metrics
  const totalPromises = extractedActions.length;
  const keptPromises = extractedActions.filter(a => a.status === 'completed').length;
  const pendingPromises = extractedActions.filter(a => a.status === 'pending').length;
  const trustScore = totalPromises > 0 ? Math.round((keptPromises / totalPromises) * 100) : 100;
  const currentStreak = 5; // This would come from actual data
  
  const filteredRecordings = meetingRecordings.filter(recording =>
    recording.meeting_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recording.meeting_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScheduleAction = (action: any) => {
    setSelectedActionForScheduling(action);
    setShowScheduleDialog(true);
  };

  const handleScheduleSubmit = async (actionId: string, scheduleData: ScheduleData) => {
    await scheduleAction(actionId, scheduleData);
    setShowScheduleDialog(false);
    setSelectedActionForScheduling(null);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleSettingChange = (key: keyof RecordingSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Settings updated');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-brain-health via-clarity-teal to-memory-emerald shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-sunrise-amber/20 via-transparent to-memory-emerald/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <CardContent className="relative pt-8 pb-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl mb-4">
              <Brain className="h-10 w-10 text-white drop-shadow-lg" />
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                P.A.C.T Clinical Registry
              </h1>
              <p className="text-xl text-white/90 mt-2 font-medium drop-shadow">
                Promises • Agreements • Commitments • Tasks
              </p>
            </div>

            {/* Compliance Metrics */}
            <div className="inline-flex items-center gap-6 bg-white/15 backdrop-blur-sm rounded-xl px-8 py-4 border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-memory-emerald-300" />
                <span className="font-semibold text-white text-lg">Compliance: {trustScore}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-clarity-teal-300" />
                <span className="font-semibold text-white text-lg">{currentStreak} day streak</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Actions */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-brain-health">
            <Target className="h-5 w-5 text-brain-health" />
            Clinical Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Button 
              size="lg" 
              className="h-20 bg-brain-health hover:bg-brain-health/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => setActiveTab('record')}
            >
              <div className="flex flex-col items-center gap-2">
                <Mic className="h-6 w-6" />
                <span className="text-sm">Record Session</span>
              </div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="h-20 border-2 border-memory-emerald hover:bg-memory-emerald/10 text-memory-emerald font-semibold transition-all duration-200"
              onClick={() => setActiveTab('calendar')}
            >
              <div className="flex flex-col items-center gap-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule</span>
              </div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="h-20 border-2 border-clarity-teal hover:bg-clarity-teal/10 text-clarity-teal font-semibold transition-all duration-200"
              onClick={() => setActiveTab('pact-reports')}
            >
              <div className="flex flex-col items-center gap-2">
                <Target className="h-6 w-6" />
                <span className="text-sm">P.A.C.T Lens</span>
              </div>
            </Button>

            <Button 
              size="lg" 
              variant="outline" 
              className="h-20 border-2 border-sunrise-amber hover:bg-sunrise-amber/10 text-sunrise-amber font-semibold transition-all duration-200"
              onClick={() => setActiveTab('support-circle')}
            >
              <div className="flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Care Team</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recording Usage Tracker */}
      <RecordingUsageTracker />

      {/* Clinical Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-brain-health/20 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brain-health">{totalPromises}</div>
              <p className="text-sm text-muted-foreground font-medium">Total P.A.C.T Items</p>
              <Target className="h-4 w-4 mx-auto mt-2 text-brain-health" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-memory-emerald/20 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-memory-emerald">{keptPromises}</div>
              <p className="text-sm text-muted-foreground font-medium">Completed</p>
              <CheckCircle className="h-4 w-4 mx-auto mt-2 text-memory-emerald" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-sunrise-amber/20 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-sunrise-amber">{pendingPromises}</div>
              <p className="text-sm text-muted-foreground font-medium">In Progress</p>
              <Clock className="h-4 w-4 mx-auto mt-2 text-sunrise-amber" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-clarity-teal/20 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-clarity-teal">{meetingRecordings.length}</div>
              <p className="text-sm text-muted-foreground font-medium">Sessions</p>
              <Mic className="h-4 w-4 mx-auto mt-2 text-clarity-teal" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border border-brain-health/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brain-health">
            <CheckCircle className="h-5 w-5" />
            Recent Clinical Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {extractedActions.slice(0, 3).map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    action.status === 'completed' ? 'bg-memory-emerald' : 
                    action.status === 'pending' ? 'bg-sunrise-amber' : 'bg-gray-400'
                  }`} />
                  <span className="font-medium text-gray-900">{action.action_text}</span>
                </div>
                <Badge 
                  variant={action.status === 'completed' ? 'default' : 'secondary'}
                  className={action.status === 'completed' ? 'bg-memory-emerald text-white' : ''}
                >
                  {action.status}
                </Badge>
              </div>
            ))}
            
            {extractedActions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 text-brain-health/50" />
                <p className="font-medium">Begin recording sessions to track clinical actions</p>
                <p className="text-sm mt-1">All P.A.C.T items will appear here for review</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPactReport = () => (
    <PACTLensTable
      actions={extractedActions}
      onUpdateAction={(actionId, updates) => {
        // Handle action updates if needed
        console.log('Updating action:', actionId, updates);
      }}
    />
  );

  const renderRecordings = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search recordings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-memory-emerald focus:border-transparent"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recordings List */}
      <div className="space-y-4">
        {filteredRecordings.map((recording) => (
          <Card key={recording.id} className="border border-memory-emerald/20 hover:border-memory-emerald/40 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{recording.meeting_title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {recording.meeting_type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(recording.created_at), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {Array.isArray(recording.participants) ? recording.participants.length : 0} participants
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recording.ended_at && recording.started_at ? 
                        `${Math.round((new Date(recording.ended_at).getTime() - new Date(recording.started_at).getTime()) / 60000)}m` : 
                        'In progress'
                      }
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredRecordings.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Mic className="h-16 w-16 mx-auto mb-4 text-memory-emerald/50" />
                <h3 className="text-lg font-semibold mb-2">No recordings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start recording conversations to build your memory archive
                </p>
                <Button 
                  onClick={() => setActiveTab('record')}
                  className="bg-gradient-to-r from-memory-emerald to-brain-health text-white"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Start First Recording
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const handleCodeWordDetected = () => {
    setActiveTab('record');
  };

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Code Word Settings */}
      <CodeWordSettings onCodeWordDetected={handleCodeWordDetected} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Recording Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Recording */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-record">Automatic Recording</Label>
              <p className="text-sm text-muted-foreground">
                Automatically start recording when conversations are detected
              </p>
            </div>
            <Switch
              id="auto-record"
              checked={settings.autoRecord}
              onCheckedChange={(checked) => handleSettingChange('autoRecord', checked)}
            />
          </div>

          {/* Retention Period */}
          <div className="space-y-3">
            <Label>Data Retention Period</Label>
            <div className="space-y-2">
              <Slider
                value={[settings.retentionDays]}
                onValueChange={([value]) => handleSettingChange('retentionDays', value)}
                max={365}
                min={7}
                step={7}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>7 days</span>
                <span>{settings.retentionDays} days selected</span>
                <span>1 year</span>
              </div>
            </div>
          </div>

          {/* Quality Level */}
          <div className="space-y-3">
            <Label>Recording Quality</Label>
            <Select 
              value={settings.qualityLevel} 
              onValueChange={(value: 'standard' | 'high' | 'clinical') => handleSettingChange('qualityLevel', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (16kHz)</SelectItem>
                <SelectItem value="high">High (44kHz)</SelectItem>
                <SelectItem value="clinical">Clinical Grade (48kHz)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Family Sharing */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="family-share">Share with Support Circle</Label>
              <p className="text-sm text-muted-foreground">
                Allow family members to view selected recordings
              </p>
            </div>
            <Switch
              id="family-share"
              checked={settings.shareWithFamily}
              onCheckedChange={(checked) => handleSettingChange('shareWithFamily', checked)}
            />
          </div>

          {/* Transcription */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="transcription">Auto-Transcription</Label>
              <p className="text-sm text-muted-foreground">
                Generate text transcripts for all recordings
              </p>
            </div>
            <Switch
              id="transcription"
              checked={settings.enableTranscription}
              onCheckedChange={(checked) => handleSettingChange('enableTranscription', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-memory-emerald/10 border border-memory-emerald/20">
            <Shield className="h-5 w-5 text-memory-emerald" />
            <div>
              <p className="font-medium text-memory-emerald">End-to-End Encryption</p>
              <p className="text-sm text-muted-foreground">All recordings are encrypted before storage</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-brain-health/10 border border-brain-health/20">
            <Crown className="h-5 w-5 text-brain-health" />
            <div>
              <p className="font-medium text-brain-health">HIPAA Compliant</p>
              <p className="text-sm text-muted-foreground">Healthcare-grade security standards</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Show senior mode by default
  if (isSeniorMode) {
    return (
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex justify-center">
          <Button
            onClick={() => setIsSeniorMode(false)}
            variant="outline"
            className="text-lg px-6 py-3"
          >
            Switch to Advanced Mode
          </Button>
        </div>
        <SeniorMemoryBridge />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Mode Toggle */}
        <div className="flex justify-center">
          <Button
            onClick={() => setIsSeniorMode(true)}
            className="bg-gradient-to-r from-memory-emerald to-brain-health text-white text-lg px-6 py-3"
          >
            Switch to Simple Mode
          </Button>
        </div>
        
        {/* Status Bar */}
        {activeMeeting?.is_active && (
          <Card className="border-2 border-red-500/50 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-semibold text-red-700 dark:text-red-300">
                  Recording in Progress - {activeMeeting?.meeting_title}
                </span>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 h-12 bg-white/70 dark:bg-gray-900/70 border border-memory-emerald/20">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-memory-emerald data-[state=active]:text-white">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="record" className="flex items-center gap-2 data-[state=active]:bg-brain-health data-[state=active]:text-white">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Record</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2 data-[state=active]:bg-memory-emerald data-[state=active]:text-white">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2 data-[state=active]:bg-memory-emerald data-[state=active]:text-white">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Actions</span>
            </TabsTrigger>
            <TabsTrigger value="pact-reports" className="flex items-center gap-2 data-[state=active]:bg-brain-health data-[state=active]:text-white">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">P.A.C.T Lens</span>
            </TabsTrigger>
            <TabsTrigger value="support-circle" className="flex items-center gap-2 data-[state=active]:bg-sunrise-amber data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Care Team</span>
            </TabsTrigger>
            <TabsTrigger value="recordings" className="flex items-center gap-2 data-[state=active]:bg-memory-emerald data-[state=active]:text-white">
              <Archive className="h-4 w-4" />
              <span className="hidden sm:inline">My Recordings</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-memory-emerald data-[state=active]:text-white">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {renderDashboard()}
          </TabsContent>

          <TabsContent value="record" className="mt-6">
            <UnifiedMemoryFlow />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CalendarView />
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <ExtractedActionsReview />
          </TabsContent>

          <TabsContent value="pact-reports" className="mt-6">
            {renderPactReport()}
          </TabsContent>

          <TabsContent value="support-circle" className="mt-6">
            <div className="text-center py-8">
              <Users className="h-16 w-16 mx-auto mb-4 text-purple-500/50" />
              <h3 className="text-lg font-semibold mb-2">Support Circle Management</h3>
              <p className="text-muted-foreground">Coming soon - Manage your trusted support network</p>
            </div>
          </TabsContent>

          <TabsContent value="recordings" className="mt-6">
            {renderRecordings()}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            {renderSettings()}
          </TabsContent>
        </Tabs>

        {/* Schedule Action Dialog */}
        <ScheduleActionDialog
          action={selectedActionForScheduling}
          isOpen={showScheduleDialog}
          onClose={() => setShowScheduleDialog(false)}
          onSchedule={handleScheduleSubmit}
        />
      </div>
    </div>
  );
}
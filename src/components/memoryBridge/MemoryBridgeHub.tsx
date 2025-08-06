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
import { CodeWordSettings } from './CodeWordSettings';
import { ProfessionalPactReport } from './ProfessionalPactReport';
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
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-memory-emerald/40 via-brain-health/30 to-memory-emerald/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-memory-emerald/60 via-transparent to-brain-health/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <CardContent className="relative pt-8 pb-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-memory-emerald via-brain-health to-memory-emerald shadow-2xl mb-4 animate-pulse">
              <Brain className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
            
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-memory-emerald-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                Capture Command Center
              </h1>
              <p className="text-xl text-white/90 mt-2 font-medium drop-shadow">
                Remember Everything - Your Trust Builder
              </p>
            </div>

            {/* Trust Score */}
            <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 border border-white/30 shadow-lg">
              <Trophy className="h-6 w-6 text-yellow-300 drop-shadow" />
              <span className="font-bold text-white text-lg drop-shadow">Trust Score: {trustScore}%</span>
              <Flame className="h-6 w-6 text-orange-300 drop-shadow" />
              <span className="font-bold text-white text-lg drop-shadow">{currentStreak} day streak</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-2 border-memory-emerald/40 bg-gradient-to-r from-white via-memory-emerald/10 to-brain-health/10 dark:from-gray-900 dark:via-memory-emerald/20 dark:to-brain-health/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="h-6 w-6 text-memory-emerald" />
            <span className="bg-gradient-to-r from-memory-emerald to-brain-health bg-clip-text text-transparent font-bold">
              Quick Actions
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button 
              size="lg" 
              className="h-24 bg-gradient-to-br from-brain-health via-emerald-500 to-clarity-teal-500 hover:from-brain-health/80 hover:via-emerald-500/80 hover:to-clarity-teal-500/80 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => setActiveTab('record')}
            >
              <div className="flex flex-col items-center gap-3">
                <Mic className="h-8 w-8 drop-shadow" />
                <span className="text-lg">Start Recording</span>
              </div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="h-24 border-3 border-memory-emerald/60 hover:bg-gradient-to-br hover:from-memory-emerald/20 hover:to-memory-emerald/30 hover:border-memory-emerald transform hover:scale-105 transition-all duration-200"
              onClick={() => setActiveTab('calendar')}
            >
              <div className="flex flex-col items-center gap-3">
                <Calendar className="h-8 w-8 text-memory-emerald" />
                <span className="text-lg font-semibold text-memory-emerald">Calendar</span>
              </div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="h-24 border-3 border-brain-health/60 hover:bg-gradient-to-br hover:from-brain-health/20 hover:to-brain-health/30 hover:border-brain-health transform hover:scale-105 transition-all duration-200"
              onClick={() => setActiveTab('pact-reports')}
            >
              <div className="flex flex-col items-center gap-3">
                <Target className="h-8 w-8 text-brain-health" />
                <span className="text-lg font-semibold text-brain-health">PACT Reports</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recording Usage Tracker */}
      <RecordingUsageTracker />

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-brain-health/50 bg-gradient-to-br from-brain-health/30 to-brain-health/40 shadow-lg transform hover:scale-105 transition-all duration-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white drop-shadow-lg">{totalPromises}</div>
              <p className="text-sm text-white/90 font-medium">Total Promises</p>
              <TrendingUp className="h-5 w-5 mx-auto mt-2 text-white drop-shadow" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-emerald/50 bg-gradient-to-br from-emerald/30 to-emerald/40 shadow-lg transform hover:scale-105 transition-all duration-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white drop-shadow-lg">{keptPromises}</div>
              <p className="text-sm text-white/90 font-medium">Kept</p>
              <CheckCircle className="h-5 w-5 mx-auto mt-2 text-white drop-shadow" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-orange-400/20 bg-gradient-to-br from-orange-100/50 to-orange-200/50 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{pendingPromises}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <Clock className="h-4 w-4 mx-auto mt-1 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-400/20 bg-gradient-to-br from-purple-100/50 to-purple-200/50 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{meetingRecordings.length}</div>
              <p className="text-sm text-muted-foreground">Recordings</p>
              <Mic className="h-4 w-4 mx-auto mt-1 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-memory-emerald" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {extractedActions.slice(0, 3).map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 rounded-lg border border-memory-emerald/10 bg-memory-emerald/5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    action.status === 'completed' ? 'bg-brain-health' : 
                    action.status === 'pending' ? 'bg-orange-500' : 'bg-gray-400'
                  }`} />
                  <span className="font-medium">{action.action_text}</span>
                </div>
                <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                  {action.status}
                </Badge>
              </div>
            ))}
            
            {extractedActions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 text-memory-emerald/50" />
                <p>Start recording conversations to see your promises here!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPactReport = () => (
    <ProfessionalPactReport
      actions={extractedActions}
      meetingTitle={activeMeeting?.meeting_title || "Recent Meetings"}
      meetingDate={activeMeeting?.created_at}
      onScheduleAction={handleScheduleAction}
      onExportPDF={handleExportPDF}
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
          <TabsList className="grid w-full grid-cols-6 h-12 bg-white/70 dark:bg-gray-900/70 border border-memory-emerald/20">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-memory-emerald data-[state=active]:text-white">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="record" className="flex items-center gap-2 data-[state=active]:bg-memory-emerald data-[state=active]:text-white">
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
            <TabsTrigger value="recordings" className="flex items-center gap-2 data-[state=active]:bg-memory-emerald data-[state=active]:text-white">
              <Archive className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="pact-reports" className="flex items-center gap-2 data-[state=active]:bg-memory-emerald data-[state=active]:text-white">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">PACT Reports</span>
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
            <UnifiedMemoryFlow />
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
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useMemoryBridge } from "@/hooks/memoryBridge/useMemoryBridge";
import { RecordingsTab } from "@/components/memoryBridge/RecordingsTab";
import { MemoryBridgeFloatingButton } from "@/components/memoryBridge/MemoryBridgeFloatingButton";
import { PersistentNavHeader } from "@/components/navigation/PersistentNavHeader";
import { QuickEscapeButton } from "@/components/navigation/QuickEscapeButton";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { Mic, Sparkles, FileAudio, Target, Calendar, TrendingUp, CheckCircle2, ArrowRight, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function MemoryBridgeSimple() {
  const navigate = useNavigate();
  const { recordings, fetchRecordings } = useVoiceRecorder();
  const { extractedActions, fetchExtractedActions } = useMemoryBridge();
  const [currentState, setCurrentState] = useState<'empty' | 'recordings' | 'actions'>('empty');

  useEffect(() => {
    fetchRecordings();
    fetchExtractedActions();
  }, []);

  useEffect(() => {
    // Determine current state based on data
    const meetingRecordings = recordings.filter(r => r.category === 'meeting');
    const actionItems = extractedActions.filter(a => a.category === 'action');

    if (actionItems.length > 0) {
      setCurrentState('actions');
    } else if (meetingRecordings.length > 0) {
      setCurrentState('recordings');
    } else {
      setCurrentState('empty');
    }
  }, [recordings, extractedActions]);

  const handleProcessComplete = (meetingId: string, actionsCount: number) => {
    fetchExtractedActions();
  };

  // Empty State - No recordings yet
  if (currentState === 'empty') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background pb-20">
        <PersistentNavHeader />
        <div className="p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center"
            >
              <Brain className="h-12 w-12 text-primary-foreground" />
            </motion.div>
            <h1 className="mobile-heading-xl md:text-5xl font-bold text-foreground mb-4">
              Memory Bridge
            </h1>
            <p className="mobile-body text-muted-foreground max-w-md mx-auto">
              Capture conversations. Discover actions. Schedule with confidence.
            </p>
          </div>

          {/* Main CTA Card */}
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-3">
                <h2 className="mobile-heading-lg font-semibold text-foreground">
                  Start Your First Recording
                </h2>
                <p className="mobile-body text-muted-foreground">
                  Your conversations will automatically transform into organized action items with personalized scheduling suggestions
                </p>
              </div>

              <MemoryBridgeFloatingButton className="relative bottom-0 right-0 w-full" />

              {/* Benefits */}
              <div className="grid gap-4 mt-8 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mic className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mobile-label font-semibold mb-1">Voice-to-Text</h3>
                    <p className="mobile-caption text-muted-foreground">
                      Accurate transcription of your meetings and conversations
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mobile-label font-semibold mb-1">AI-Powered Extraction</h3>
                    <p className="mobile-caption text-muted-foreground">
                      Automatically discover action items from your recordings
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mobile-label font-semibold mb-1">Smart Scheduling</h3>
                    <p className="mobile-caption text-muted-foreground">
                      Personalized time suggestions based on your peak performance
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </div>
        <QuickEscapeButton />
        <MobileBottomNav />
      </div>
    );
  }

  // Recordings State - Has recordings but no actions yet
  if (currentState === 'recordings') {
    const meetingRecordings = recordings.filter(r => r.category === 'meeting');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background pb-20">
        <PersistentNavHeader />
        <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="mobile-heading-xl md:text-4xl font-bold text-foreground">
                Your Recordings
              </h1>
              <Badge variant="secondary" className="mobile-label">
                {meetingRecordings.length} Recording{meetingRecordings.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <p className="mobile-body text-muted-foreground">
              Process your recordings to discover actionable insights
            </p>
          </motion.div>

          {/* Recordings List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <RecordingsTab onProcessComplete={handleProcessComplete} />
          </motion.div>
        </div>
        </div>

        {/* Floating Action Button */}
        <MemoryBridgeFloatingButton />
        <QuickEscapeButton />
        <MobileBottomNav />
      </div>
    );
  }

  // Actions State - Has extracted actions
  const highPriorityActions = extractedActions.filter(a => a.priority_level === 1 && a.category === 'action');
  const totalActions = extractedActions.filter(a => a.category === 'action').length;
  const completedActions = extractedActions.filter(a => a.status === 'completed').length;
  const scheduledActions = extractedActions.filter(a => a.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background pb-20">
      <PersistentNavHeader />
      <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mobile-heading-xl md:text-4xl font-bold text-foreground mb-2">
            Your Next Steps
          </h1>
          <p className="mobile-body text-muted-foreground">
            Empowering actions ready for your attention
          </p>
        </motion.div>

        {/* Executive Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
            <CardHeader>
              <CardTitle className="mobile-heading-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Priorities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <p className="mobile-caption text-muted-foreground">High Priority</p>
                  </div>
                  <p className="mobile-heading-md font-bold">{highPriorityActions.length}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <p className="mobile-caption text-muted-foreground">Scheduled</p>
                  </div>
                  <p className="mobile-heading-md font-bold">{scheduledActions}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="mobile-caption text-muted-foreground">Completed</p>
                  </div>
                  <p className="mobile-heading-md font-bold">{completedActions}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <p className="mobile-caption text-muted-foreground">Total Actions</p>
                  </div>
                  <p className="mobile-heading-md font-bold">{totalActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* High Priority Actions */}
        {highPriorityActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="mobile-heading-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    Priority Actions
                  </span>
                  <Badge variant="destructive">{highPriorityActions.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {highPriorityActions.slice(0, 3).map((action) => (
                  <Card key={action.id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="mobile-label font-semibold mb-2">{action.action_text}</h3>
                      
                      {/* AI Recommendation */}
                      <div className="bg-primary/5 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="mobile-caption font-semibold text-primary">Smart Scheduling</span>
                        </div>
                        <p className="mobile-caption text-muted-foreground">
                          Based on your assessment: Best scheduled during your peak focus time
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {action.assigned_to && (
                            <Badge variant="outline" className="mobile-caption">
                              {action.assigned_to}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="mobile-caption capitalize">
                            {action.status?.replace('_', ' ') || 'Ready to Begin'}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/next-steps')}
                          className="text-primary hover:text-primary/80"
                        >
                          Schedule
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/next-steps')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mobile-label font-semibold mb-1">All Actions</h3>
                    <p className="mobile-caption text-muted-foreground">View and manage everything</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/memory-bridge')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileAudio className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mobile-label font-semibold mb-1">Recordings</h3>
                    <p className="mobile-caption text-muted-foreground">Listen and process</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>

      {/* Floating Action Button */}
      <MemoryBridgeFloatingButton />
      <QuickEscapeButton />
      <MobileBottomNav />
    </div>
  );
}

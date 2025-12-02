import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useMemoryBridge } from "@/hooks/memoryBridge/useMemoryBridge";
import { RecordingsTab } from "@/components/memoryBridge/RecordingsTab";
import { MemoryBridgeFloatingButton } from "@/components/memoryBridge/MemoryBridgeFloatingButton";
import { PromiseScore } from "@/components/memoryBridge/PromiseScore";
import { PersistentNavHeader } from "@/components/navigation/PersistentNavHeader";
import { QuickEscapeButton } from "@/components/navigation/QuickEscapeButton";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { AppSignature } from "@/components/shared/AppSignature";
import { BrainBoostWidget } from "@/components/memoryBridge/BrainBoostWidget";
import { Mic, Sparkles, FileAudio, Target, Calendar, TrendingUp, CheckCircle2, ArrowRight, Brain, Zap, Heart, Users, Clock } from "lucide-react";
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

  // Calculate stats
  const totalActions = extractedActions.filter(a => a.category === 'action').length;
  const completedActions = extractedActions.filter(a => a.status === 'completed').length;
  const scheduledActions = extractedActions.filter(a => a.status === 'scheduled').length;
  const highPriorityActions = extractedActions.filter(a => a.priority_level === 1 && a.category === 'action');
  
  // Calculate streak (simplified - in real app, fetch from database)
  const today = new Date().toDateString();
  const hasCompletedToday = extractedActions.some(a => 
    a.status === 'completed' && 
    new Date(a.completion_date || '').toDateString() === today
  );
  const streakDays = hasCompletedToday ? 1 : 0; // Simplified - would need proper tracking

  // Empty State - Beautiful onboarding
  if (currentState === 'empty') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-green-500/5 pb-20">
        <PersistentNavHeader />
        <div className="p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-purple-500 to-green-500 flex items-center justify-center shadow-2xl"
              >
                <Brain className="h-14 w-14 text-white" />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-green-500 bg-clip-text text-transparent mb-4"
              >
                Memory Bridge
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-muted-foreground max-w-md mx-auto"
              >
                Your personal assistant that never lets you forget a promise
              </motion.p>
            </div>

            {/* Main CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-2 border-primary/30 shadow-2xl bg-gradient-to-br from-background to-primary/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/20 to-transparent rounded-tr-full" />
                
                <CardContent className="p-8 text-center space-y-6 relative">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">
                      Start Your First Recording
                    </h2>
                    <p className="text-muted-foreground">
                      Conversations → Actions → Scheduled → Done ✓
                    </p>
                  </div>

                  <MemoryBridgeFloatingButton className="relative bottom-0 right-0 w-full" />

                  {/* Value Props with Icons */}
                  <div className="grid gap-4 mt-8 text-left">
                    {[
                      { icon: Mic, title: "Capture Everything", desc: "Voice-to-text transcription in real-time", color: "text-blue-500" },
                      { icon: Brain, title: "AI Finds Your Actions", desc: "Commitments extracted automatically", color: "text-purple-500" },
                      { icon: Calendar, title: "Smart Scheduling", desc: "Based on your peak productivity times", color: "text-green-500" },
                      { icon: Users, title: "Support Circle", desc: "Your team gets notified to encourage you", color: "text-orange-500" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0`}>
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm mb-0.5">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Social Proof */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="pt-4 border-t flex items-center justify-center gap-2 text-sm text-muted-foreground"
                  >
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Trusted by people who want to keep their promises</span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* App Signature */}
            <AppSignature className="mt-8" />
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Your Recordings
                </h1>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {meetingRecordings.length} Recording{meetingRecordings.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Process your recordings to discover actionable insights
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <RecordingsTab onProcessComplete={handleProcessComplete} />
            </motion.div>

            {/* App Signature */}
            <AppSignature className="mt-8" />
          </div>
        </div>

        <MemoryBridgeFloatingButton />
        <QuickEscapeButton />
        <MobileBottomNav />
      </div>
    );
  }

  // Actions State - Full dashboard with Promise Score
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-green-500/5 pb-20">
      <PersistentNavHeader />
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-green-500 bg-clip-text text-transparent mb-2">
              Your Promise Dashboard
            </h1>
            <p className="text-muted-foreground">
              Every commitment captured. Every promise tracked.
            </p>
          </motion.div>

          {/* Promise Score - Hero Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PromiseScore
              completedCount={completedActions}
              totalCount={totalActions}
              streakDays={streakDays}
            />
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "High Priority", value: highPriorityActions.length, icon: Zap, color: "text-red-500", bg: "bg-red-500/10" },
              { label: "Scheduled", value: scheduledActions, icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Completed", value: completedActions, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
              { label: "Total Actions", value: totalActions, icon: Target, color: "text-primary", bg: "bg-primary/10" },
            ].map((stat, index) => (
              <Card key={index} className={`${stat.bg} border-none`}>
                <CardContent className="p-4 text-center">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* High Priority Actions */}
          {highPriorityActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-red-500" />
                      Needs Your Attention
                    </span>
                    <Badge variant="destructive">{highPriorityActions.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {highPriorityActions.slice(0, 3).map((action) => (
                    <motion.div
                      key={action.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 bg-background rounded-xl border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate('/next-steps')}
                    >
                      <h3 className="font-semibold mb-2">{action.action_text}</h3>
                      
                      {/* Smart Scheduling Suggestion */}
                      <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 rounded-lg p-2 mb-2">
                        <Sparkles className="h-4 w-4" />
                        <span>AI suggests: {action.best_time || "Schedule for your peak focus time"}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {action.due_context && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {action.due_context}
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary">
                          Schedule <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <Card 
              className="hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-primary/5 to-background border-primary/20" 
              onClick={() => navigate('/next-steps')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">View All Actions</h3>
                      <p className="text-sm text-muted-foreground">Manage and schedule your commitments</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-green-500/5 to-background border-green-500/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileAudio className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Your Recordings</h3>
                      <p className="text-sm text-muted-foreground">{recordings.filter(r => r.category === 'meeting').length} conversations captured</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Brain Boost */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <BrainBoostWidget />
          </motion.div>

          {/* App Signature */}
          <AppSignature />
        </div>
      </div>

      <MemoryBridgeFloatingButton />
      <QuickEscapeButton />
      <MobileBottomNav />
    </div>
  );
}

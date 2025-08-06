
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, List, Target, Heart, Brain } from 'lucide-react';
import { SeniorVoiceRecorder } from './SeniorVoiceRecorder';
import { SeniorRecordingsList } from './SeniorRecordingsList';
import { SeniorFollowThroughTab } from './SeniorFollowThroughTab';

export function SeniorMemoryBridge() {
  const [activeTab, setActiveTab] = useState('record');

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <Card className="mb-8 border-2 border-brain-health/40 bg-gradient-to-br from-brain-health/10 via-emerald/5 to-clarity-teal/10">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-bold mb-3 bg-gradient-to-r from-brain-health to-emerald-600 bg-clip-text text-transparent">
            Memory Bridge
          </CardTitle>
          <p className="text-xl text-muted-foreground mb-4">
            Never forget a promise or let anyone down again
          </p>
          <div className="flex items-center justify-center gap-2 text-brain-health">
            <Heart className="h-5 w-5" />
            <span className="text-lg font-medium">Building Trust Through Every Conversation</span>
            <Heart className="h-5 w-5" />
          </div>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-16 mb-8">
          <TabsTrigger value="record" className="text-lg py-4 flex items-center gap-3">
            <Mic className="h-6 w-6" />
            <span className="font-medium">Record</span>
          </TabsTrigger>
          <TabsTrigger value="recordings" className="text-lg py-4 flex items-center gap-3">
            <List className="h-6 w-6" />
            <span className="font-medium">My Recordings</span>
          </TabsTrigger>
          <TabsTrigger value="follow-through" className="text-lg py-4 flex items-center gap-3">
            <Target className="h-6 w-6" />
            <span className="font-medium">Follow Through</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="record" className="mt-6">
          <SeniorVoiceRecorder />
        </TabsContent>
        
        <TabsContent value="recordings" className="mt-6">
          <SeniorRecordingsList />
        </TabsContent>
        
        <TabsContent value="follow-through" className="mt-6">
          <SeniorFollowThroughTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

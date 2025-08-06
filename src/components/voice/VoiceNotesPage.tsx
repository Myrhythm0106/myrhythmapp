
import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { VoiceRecorder } from './VoiceRecorder';
import { VoiceRecordingsList } from './VoiceRecordingsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, List, Target } from 'lucide-react';
import { FollowThroughTab } from './FollowThroughTab';

export function VoiceNotesPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Voice Notes"
        subtitle="Record, organize, and manage your voice notes with healthcare professional access"
      />
      
      <Tabs defaultValue="record" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="record" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            New Recording
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            My Recordings
          </TabsTrigger>
          <TabsTrigger value="follow-through" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Follow Through
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="record" className="mt-6">
          <VoiceRecorder />
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <VoiceRecordingsList />
        </TabsContent>
        
        <TabsContent value="follow-through" className="mt-6">
          <FollowThroughTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

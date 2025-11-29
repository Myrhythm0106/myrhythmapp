
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Play, Trash2, Search, Calendar, FileText, Heart, Stethoscope, User, Sparkles, Loader2, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { DeleteConfirmationDialog } from '@/components/ui/DeleteConfirmationDialog';
import { VoiceRecordingACTs } from './VoiceRecordingACTs';
import { VoiceRecording } from '@/types/voiceRecording';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Use VoiceRecording directly since it now includes AI fields

interface ExtractedACT {
  id: string;
  action_text: string;
  category: 'action' | 'watch_out' | 'depends_on' | 'note';
  assigned_to: string | null;
  due_context: string | null;
  proposed_date: string | null;
  proposed_time: string | null;
  priority_level: number;
  micro_tasks: { text: string; completed: boolean }[];
  success_criteria: string | null;
  motivation_statement: string | null;
  status: string;
}

export function VoiceRecordingsList() {
  const {
    recordings,
    fetchRecordings,
    deleteRecording,
    getRecordingUrl
  } = useVoiceRecorder();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);
  const [expandedRecordings, setExpandedRecordings] = useState<Set<string>>(new Set());
  const [recordingACTs, setRecordingACTs] = useState<Record<string, ExtractedACT[]>>({});
  const [processingRecordings, setProcessingRecordings] = useState<Set<string>>(new Set());
  
  const deleteConfirmation = useDeleteConfirmation();

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  const getCategoryIcon = (category: VoiceRecording['category']) => {
    switch (category) {
      case 'symptoms': return <Stethoscope className="h-4 w-4" />;
      case 'mood': return <Heart className="h-4 w-4" />;
      case 'medical': return <FileText className="h-4 w-4" />;
      case 'calendar': return <Calendar className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: VoiceRecording['category']) => {
    switch (category) {
      case 'symptoms': return 'bg-red-100 text-red-800';
      case 'mood': return 'bg-blue-100 text-blue-800';
      case 'medical': return 'bg-green-100 text-green-800';
      case 'calendar': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.transcription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.ai_summary?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || recording.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handlePlay = async (recording: VoiceRecording) => {
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
    }

    const url = await getRecordingUrl(recording.file_path);
    if (url) {
      const audio = new Audio(url);
      audio.play();
      setPlayingAudio(audio);
      
      audio.onended = () => {
        setPlayingAudio(null);
      };
    }
  };

  const handleDeleteClick = (recording: VoiceRecording) => {
    deleteConfirmation.confirmDelete(
      {
        id: recording.id,
        name: recording.title,
        type: 'recording'
      },
      () => handleDelete(recording.id)
    );
  };

  const handleDelete = async (recordingId: string) => {
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
    }
    await deleteRecording(recordingId);
  };

  const toggleExpanded = async (recordingId: string) => {
    const newExpanded = new Set(expandedRecordings);
    if (newExpanded.has(recordingId)) {
      newExpanded.delete(recordingId);
    } else {
      newExpanded.add(recordingId);
      // Fetch ACTs for this recording if not already loaded
      if (!recordingACTs[recordingId]) {
        await fetchACTsForRecording(recordingId);
      }
    }
    setExpandedRecordings(newExpanded);
  };

  const fetchACTsForRecording = async (recordingId: string) => {
    try {
      // First find the meeting recording linked to this voice recording
      const { data: meetingRecording } = await supabase
        .from('meeting_recordings')
        .select('id')
        .eq('recording_id', recordingId)
        .single();

      if (meetingRecording) {
        const { data: acts } = await supabase
          .from('extracted_actions')
          .select('*')
          .eq('meeting_recording_id', meetingRecording.id)
          .order('priority_level', { ascending: true });

        if (acts) {
          setRecordingACTs(prev => ({ 
            ...prev, 
            [recordingId]: acts.map(act => ({
              ...act,
              micro_tasks: (act.micro_tasks as { text: string; completed: boolean }[]) || []
            })) as ExtractedACT[]
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching ACTs:', error);
    }
  };

  const handleProcessWithAI = async (recording: VoiceRecording) => {
    setProcessingRecordings(prev => new Set(prev).add(recording.id));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to use AI processing');
        return;
      }

      const response = await supabase.functions.invoke('process-voice-recording', {
        body: { 
          recording_id: recording.id,
          transcription: recording.transcription 
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { summary, extracted_acts_count } = response.data;
      
      toast.success(
        `AI processed! Found ${extracted_acts_count} action items.`,
        { description: summary?.substring(0, 100) + '...' }
      );

      // Refresh recordings to get updated data
      fetchRecordings();
      
      // Fetch ACTs for this recording
      await fetchACTsForRecording(recording.id);
      
      // Auto-expand to show results
      setExpandedRecordings(prev => new Set(prev).add(recording.id));
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('Failed to process with AI. Please try again.');
    } finally {
      setProcessingRecordings(prev => {
        const newSet = new Set(prev);
        newSet.delete(recording.id);
        return newSet;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Recordings</CardTitle>
        
        {/* Search and Filter */}
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General Notes</SelectItem>
              <SelectItem value="symptoms">Symptom Logs</SelectItem>
              <SelectItem value="mood">Mood Notes</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="calendar">Calendar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredRecordings.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {recordings.length === 0 ? 'No recordings yet' : 'No recordings match your search'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecordings.map((recording) => (
              <Collapsible
                key={recording.id}
                open={expandedRecordings.has(recording.id)}
                onOpenChange={() => toggleExpanded(recording.id)}
              >
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-medium">{recording.title}</h3>
                          <Badge
                            variant="outline"
                            className={getCategoryColor(recording.category)}
                          >
                            {getCategoryIcon(recording.category)}
                            <span className="ml-1 capitalize">{recording.category}</span>
                          </Badge>
                          {recording.access_level === 'healthcare' && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Shared with Healthcare
                            </Badge>
                          )}
                          {recording.legal_retention_required && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              Legally Protected
                            </Badge>
                          )}
                          {recording.processing_status === 'completed' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI Processed
                            </Badge>
                          )}
                          {(recording.extracted_actions_count || 0) > 0 && (
                            <Badge variant="secondary">
                              {recording.extracted_actions_count} ACTs
                            </Badge>
                          )}
                        </div>
                        
                        {recording.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {recording.description}
                          </p>
                        )}
                        
                        {/* AI Summary */}
                        {recording.ai_summary && (
                          <div className="text-sm bg-primary/5 p-3 rounded border-l-2 border-primary mb-2">
                            <div className="font-medium text-xs text-primary mb-1 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              AI Summary
                            </div>
                            <p>{recording.ai_summary}</p>
                          </div>
                        )}

                        {/* Key Insights */}
                        {recording.key_insights && recording.key_insights.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {recording.key_insights.slice(0, 3).map((insight, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="text-xs"
                              >
                                <Lightbulb className="h-3 w-3 mr-1" />
                                {insight.insight.substring(0, 40)}...
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {recording.transcription && !recording.ai_summary && (
                          <div className="text-sm bg-gray-50 p-2 rounded border-l-2 border-blue-200">
                            <div className="font-medium text-xs text-blue-600 mb-1">
                              Transcription
                            </div>
                            <p className="line-clamp-2">{recording.transcription}</p>
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(recording.created_at), { addSuffix: true })}
                          {recording.duration_seconds && (
                            <span className="ml-2">
                              • {Math.floor(recording.duration_seconds / 60)}:{(recording.duration_seconds % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {/* AI Process Button */}
                        {recording.transcription && recording.processing_status !== 'completed' && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProcessWithAI(recording);
                            }}
                            size="sm"
                            variant="outline"
                            disabled={processingRecordings.has(recording.id)}
                            className="gap-1"
                          >
                            {processingRecordings.has(recording.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                        )}

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlay(recording);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        
                        {!recording.legal_retention_required && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(recording);
                            }}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Expand/Collapse for ACTs */}
                        {(recording.extracted_actions_count || 0) > 0 && (
                          <CollapsibleTrigger asChild>
                            <Button size="sm" variant="ghost">
                              {expandedRecordings.has(recording.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded ACTs Section */}
                  <CollapsibleContent>
                    <div className="border-t bg-muted/30 p-4">
                      <VoiceRecordingACTs 
                        acts={recordingACTs[recording.id] || []}
                        onRefresh={() => fetchACTsForRecording(recording.id)}
                      />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
      
      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onConfirm={deleteConfirmation.handleConfirm}
        onCancel={deleteConfirmation.handleCancel}
        title={deleteConfirmation.title}
        description={deleteConfirmation.description}
        itemName={deleteConfirmation.itemName}
      />
    </Card>
  );
}

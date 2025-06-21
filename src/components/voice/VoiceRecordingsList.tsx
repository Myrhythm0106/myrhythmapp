
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Play, Trash2, Search, Calendar, FileText, Heart, Stethoscope, User } from 'lucide-react';
import { useVoiceRecorder, VoiceRecording } from '@/hooks/useVoiceRecorder';
import { formatDistanceToNow } from 'date-fns';

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
      recording.transcription?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || recording.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handlePlay = async (recording: VoiceRecording) => {
    // Stop any currently playing audio
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

  const handleDelete = async (recordingId: string) => {
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
    }
    await deleteRecording(recordingId);
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
              <div
                key={recording.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
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
                    </div>
                    
                    {recording.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {recording.description}
                      </p>
                    )}
                    
                    {recording.transcription && (
                      <div className="text-sm bg-gray-50 p-2 rounded border-l-2 border-blue-200">
                        <div className="font-medium text-xs text-blue-600 mb-1">
                          Transcription
                        </div>
                        <p>{recording.transcription}</p>
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
                    <Button
                      onClick={() => handlePlay(recording)}
                      size="sm"
                      variant="outline"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    
                    {!recording.legal_retention_required && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Recording</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{recording.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(recording.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { 
  Play, 
  Pause, 
  Trash2, 
  Search, 
  Clock,
  Calendar,
  Edit,
  Archive,
  Star,
  StarOff,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceRecording } from '@/types/voiceRecording';
import { formatDistanceToNow } from 'date-fns';

interface MyRecordingsProps {
  onSelectRecording?: (recording: VoiceRecording) => void;
}

export function MyRecordings({ onSelectRecording }: MyRecordingsProps) {
  const {
    recordings,
    fetchRecordings,
    deleteRecording,
    getRecordingUrl
  } = useVoiceRecorder();

  const [searchTerm, setSearchTerm] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetchRecordings();
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('recording-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, [fetchRecordings]);

  const filteredRecordings = recordings.filter(recording =>
    recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recording.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort recordings: favorites first, then by date
  const sortedRecordings = [...filteredRecordings].sort((a, b) => {
    const aFavorite = favorites.has(a.id);
    const bFavorite = favorites.has(b.id);
    
    if (aFavorite && !bFavorite) return -1;
    if (!aFavorite && bFavorite) return 1;
    
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handlePlay = async (recording: VoiceRecording) => {
    try {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setPlayingId(null);
      }

      if (playingId === recording.id) {
        return; // Just stopped, don't play again
      }

      const url = await getRecordingUrl(recording.file_path);
      if (url) {
        const audio = new Audio(url);
        audio.onended = () => {
          setPlayingId(null);
          setCurrentAudio(null);
        };
        audio.onerror = () => {
          setPlayingId(null);
          setCurrentAudio(null);
        };
        
        setCurrentAudio(audio);
        setPlayingId(recording.id);
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing recording:', error);
    }
  };

  const handleStop = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingId(null);
    }
  };

  const toggleFavorite = (recordingId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recordingId)) {
      newFavorites.delete(recordingId);
    } else {
      newFavorites.add(recordingId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('recording-favorites', JSON.stringify([...newFavorites]));
  };

  const formatDuration = (durationSeconds: number | null) => {
    if (!durationSeconds) return 'Unknown';
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pact':
        return '🎯';
      case 'medical':
        return '🏥';
      case 'symptoms':
        return '📝';
      case 'mood':
        return '💭';
      default:
        return '📁';
    }
  };

  if (recordings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FolderOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Recordings Yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start by making your first recording to capture your P.A.C.T.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search your recordings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {/* Recordings Grid */}
      <div className="grid gap-4">
        {sortedRecordings.map((recording) => (
          <Card 
            key={recording.id} 
            className={cn(
              "transition-all hover:shadow-md cursor-pointer",
              favorites.has(recording.id) && "ring-2 ring-yellow-300 bg-yellow-50",
              playingId === recording.id && "ring-2 ring-blue-300 bg-blue-50"
            )}
            onClick={() => onSelectRecording?.(recording)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Play Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (playingId === recording.id) {
                      handleStop();
                    } else {
                      handlePlay(recording);
                    }
                  }}
                  size="lg"
                  className={cn(
                    "h-16 w-16 rounded-full flex-shrink-0",
                    playingId === recording.id 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {playingId === recording.id ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>

                {/* Recording Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {getCategoryIcon(recording.category)} {recording.title}
                      </h3>
                      {recording.description && (
                        <p className="text-gray-600 mt-1 line-clamp-2">
                          {recording.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Favorite Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(recording.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      {favorites.has(recording.id) ? (
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(recording.created_at), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(recording.duration_seconds)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Recording?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{recording.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteRecording(recording.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecordings.length === 0 && searchTerm && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No recordings found
            </h3>
            <p className="text-gray-500">
              Try searching with different keywords
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
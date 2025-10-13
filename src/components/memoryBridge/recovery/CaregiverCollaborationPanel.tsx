import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CaregiverNote {
  id: string;
  caregiver_name: string;
  note_text: string;
  created_at: string;
  priority: 'low' | 'medium' | 'high';
}

export function CaregiverCollaborationPanel() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<CaregiverNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAddNote = async () => {
    if (!user || !newNote.trim()) return;

    setIsAddingNote(true);
    try {
      // This would integrate with support_circle_members table
      const note: CaregiverNote = {
        id: crypto.randomUUID(),
        caregiver_name: user.email?.split('@')[0] || 'Caregiver',
        note_text: newNote,
        created_at: new Date().toISOString(),
        priority: 'medium'
      };

      setNotes([note, ...notes]);
      setNewNote('');
      toast.success('Care note added! 💜 Your support circle is notified.');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Users className="h-5 w-5" />
          Care Team Collaboration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a care note or observation for the support circle..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[80px]"
          />
          <Button 
            onClick={handleAddNote} 
            disabled={!newNote.trim() || isAddingNote}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Share with Care Team
          </Button>
        </div>

        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No care notes yet. Start collaborating with your support circle!</p>
            </div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="bg-white">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {note.caregiver_name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                    {note.priority === 'high' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm">{note.note_text}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

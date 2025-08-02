import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PostRecordingSetup } from './PostRecordingSetup';
import { Edit } from 'lucide-react';
import { MeetingRecording } from '@/types/memoryBridge';

interface PostRecordingEditButtonProps {
  meeting: MeetingRecording;
  onUpdate: (meeting: MeetingRecording) => void;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
}

export function PostRecordingEditButton({ 
  meeting, 
  onUpdate, 
  variant = 'outline', 
  size = 'sm' 
}: PostRecordingEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = (updatedMeeting: MeetingRecording) => {
    onUpdate(updatedMeeting);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Context
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Recording Context</DialogTitle>
        </DialogHeader>
        <PostRecordingSetup
          meeting={meeting}
          onUpdate={handleUpdate}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import { MessageComposer } from "./MessageComposer";
import { MessageItem } from "./MessageItem";
import { Message } from "./types/messageTypes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MessageBoard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        initials: "SJ",
      },
      content: "Just checking in - how are you feeling after yesterday's appointment?",
      time: "2h ago",
      likes: 1,
      type: 'message',
    },
    {
      id: "2",
      user: {
        name: "Dr. Smith",
        initials: "DS",
      },
      content: "Your progress has been remarkable this month. Keep up with the exercises we discussed!",
      time: "8h ago",
      likes: 3,
      type: 'encouragement',
    },
    {
      id: "3",
      user: {
        name: "Mom",
        initials: "M",
      },
      content: "I made your favorite dinner for when you visit this weekend. Looking forward to seeing you!",
      time: "1d ago",
      likes: 2,
      type: 'message',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'messages' | 'encouragement'>('all');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        user: {
          name: "You",
          initials: "Y",
        },
        content: content,
        time: "Just now",
        likes: 0,
        type: 'message',
      };
      setMessages([message, ...messages]);
      toast.success("Message sent!");
    }
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
    toast.success("Message deleted");
  };

  const likeMessage = (id: string) => {
    setMessages(messages.map(message => 
      message.id === id ? { ...message, likes: message.likes + 1 } : message
    ));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          setAudioChunks([...chunks]);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create voice note message
        const message: Message = {
          id: Date.now().toString(),
          user: {
            name: "You",
            initials: "Y",
          },
          content: `<audio controls src="${audioUrl}"></audio>`,
          time: "Just now",
          likes: 0,
          type: 'message',
        };
        
        setMessages([message, ...messages]);
        toast.success("Voice note sent!");
        
        // Clear recording state
        setAudioChunks([]);
      };
      
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(message => message.type === filter);

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex gap-2 mb-2">
          <MessageComposer onSendMessage={handleSendMessage} />
          {isRecording ? (
            <Button 
              onClick={stopRecording} 
              className="flex-shrink-0 bg-red-500 hover:bg-red-600 animate-pulse"
            >
              <MicOff className="mr-1 h-4 w-4" />
              Stop Recording
            </Button>
          ) : (
            <Button 
              onClick={startRecording} 
              className="flex-shrink-0"
            >
              <Mic className="mr-1 h-4 w-4" />
              Voice Note
            </Button>
          )}
        </div>
        {isRecording && (
          <div className="text-center text-sm text-red-500 animate-pulse mt-1">
            Recording voice note... Click Stop when finished.
          </div>
        )}
      </div>

      <div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="encouragement">Encouragement</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <MessageItem 
              key={message.id} 
              message={message} 
              onLike={likeMessage} 
              onDelete={deleteMessage} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

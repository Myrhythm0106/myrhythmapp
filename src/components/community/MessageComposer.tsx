
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
}

export function MessageComposer({ onSendMessage }: MessageComposerProps) {
  const [newMessage, setNewMessage] = useState("");
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-muted rounded-lg flex-grow">
      <Textarea 
        placeholder="Share an update or send encouragement..." 
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        className="bg-background resize-none"
        rows={3}
      />
      <div className="flex justify-end mt-2">
        <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </div>
    </div>
  );
}

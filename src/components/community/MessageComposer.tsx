
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

  return (
    <div className="bg-muted p-4 rounded-lg">
      <Textarea 
        placeholder="Share an update or send encouragement..." 
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="mb-3 bg-background"
        rows={3}
      />
      <div className="flex justify-end">
        <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </div>
    </div>
  );
}

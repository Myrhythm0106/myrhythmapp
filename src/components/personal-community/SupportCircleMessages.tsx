
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send } from "lucide-react";
import { useSupportCircle, SupportMessage } from "@/hooks/use-support-circle";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SupportCircleMessages() {
  const { messages, addMessage, markMessageAsRead, members } = useSupportCircle();
  const [newMessage, setNewMessage] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || "");

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMemberId) {
      addMessage(selectedMemberId, newMessage.trim());
      setNewMessage("");
    }
  };

  const handleClickMessage = (messageId: string) => {
    markMessageAsRead(messageId);
  };

  // Count unread messages
  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Support Circle Messages</span>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[300px] border rounded-md overflow-hidden">
            <ScrollArea className="h-full p-4">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageItem 
                      key={message.id} 
                      message={message} 
                      onClick={() => handleClickMessage(message.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No messages yet
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label htmlFor="member-select" className="text-sm font-medium">
                Send message to:
              </label>
              <select 
                id="member-select"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="border rounded p-1 text-sm min-w-[150px]"
              >
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              placeholder="Write a message to your support circle member..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="resize-none"
              rows={3}
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || !selectedMemberId}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MessageItemProps {
  message: SupportMessage;
  onClick: () => void;
}

function MessageItem({ message, onClick }: MessageItemProps) {
  return (
    <div 
      className={`p-3 rounded-lg border ${!message.read ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium">{message.memberName}</div>
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </div>
      </div>
      <p className="text-sm">{message.message}</p>
      {!message.read && (
        <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/30">
          New
        </Badge>
      )}
    </div>
  );
}

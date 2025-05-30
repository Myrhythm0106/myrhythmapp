
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send, ArrowLeft, Users } from "lucide-react";
import { useSupportCircle, SupportMessage } from "@/hooks/use-support-circle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export function SupportCircleMessaging() {
  const { messages, addMessage, markMessageAsRead, members } = useSupportCircle();
  const [newMessage, setNewMessage] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMemberId) {
      addMessage(selectedMemberId, newMessage.trim());
      setNewMessage("");
      toast.success("Message sent successfully!");
    }
  };

  const handleMessageClick = (messageId: string) => {
    markMessageAsRead(messageId);
  };

  // Group messages by member for conversation view
  const conversationsByMember = messages.reduce((acc, message) => {
    if (!acc[message.memberId]) {
      acc[message.memberId] = [];
    }
    acc[message.memberId].push(message);
    return acc;
  }, {} as Record<string, SupportMessage[]>);

  // Count unread messages
  const unreadCount = messages.filter(msg => !msg.read).length;

  if (selectedConversation) {
    const conversationMessages = conversationsByMember[selectedConversation] || [];
    const member = members.find(m => m.id === selectedConversation);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedConversation(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Chat with {member?.name}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ScrollArea className="h-[400px] border rounded-md p-4">
              {conversationMessages.length > 0 ? (
                <div className="space-y-4">
                  {conversationMessages.map((message) => (
                    <MessageBubble 
                      key={message.id} 
                      message={message} 
                      onClick={() => handleMessageClick(message.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No messages with {member?.name} yet
                </div>
              )}
            </ScrollArea>

            <div className="space-y-3">
              <Textarea
                placeholder={`Write a message to ${member?.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="resize-none"
                rows={3}
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => {
                    setSelectedMemberId(selectedConversation);
                    handleSendMessage();
                  }}
                  disabled={!newMessage.trim()}
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
          {/* Send New Message Section */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="font-medium mb-3">Send New Message</h3>
            <div className="space-y-3">
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a support circle member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Write your message..."
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

          {/* Conversations List */}
          <div>
            <h3 className="font-medium mb-3">Recent Conversations</h3>
            {members.length > 0 ? (
              <div className="space-y-2">
                {members.map(member => {
                  const memberMessages = conversationsByMember[member.id] || [];
                  const latestMessage = memberMessages[0];
                  const unreadForMember = memberMessages.filter(msg => !msg.read).length;
                  
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedConversation(member.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{member.name}</span>
                          {unreadForMember > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {unreadForMember} new
                            </Badge>
                          )}
                        </div>
                        {latestMessage ? (
                          <div className="text-sm text-muted-foreground">
                            {latestMessage.message.substring(0, 50)}
                            {latestMessage.message.length > 50 ? '...' : ''}
                            <span className="ml-2">
                              {formatDistanceToNow(latestMessage.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">No messages yet</div>
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="mx-auto h-10 w-10 mb-2" />
                <p>No support circle members added yet</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MessageBubbleProps {
  message: SupportMessage;
  onClick: () => void;
}

function MessageBubble({ message, onClick }: MessageBubbleProps) {
  const isFromUser = message.memberName === "You";
  
  return (
    <div 
      className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} mb-4`}
      onClick={onClick}
    >
      <div 
        className={`max-w-[70%] p-3 rounded-lg ${
          isFromUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        } ${!message.read && !isFromUser ? 'ring-2 ring-primary/20' : ''}`}
      >
        <div className="text-sm font-medium mb-1">
          {message.memberName}
        </div>
        <p className="text-sm">{message.message}</p>
        <div className={`text-xs mt-1 ${isFromUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </div>
        {!message.read && !isFromUser && (
          <Badge variant="outline" className="mt-1 bg-primary/10 text-primary border-primary/30 text-xs">
            New
          </Badge>
        )}
      </div>
    </div>
  );
}

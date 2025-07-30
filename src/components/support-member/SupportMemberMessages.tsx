import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Heart,
  Star,
  Clock
} from 'lucide-react';
import { useSupportCircleMessaging } from '@/hooks/use-support-circle-messaging';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface SupportMemberMessagesProps {
  userId: string;
  supportedUserName: string;
}

export function SupportMemberMessages({ userId, supportedUserName }: SupportMemberMessagesProps) {
  const { messages, isLoading, sendMessage, unreadCount } = useSupportCircleMessaging();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const messageTemplates = [
    "Thinking of you today! Hope you're doing well. 💙",
    "You're doing amazing! Keep up the great work! 🌟",
    "Just wanted to check in and send some love your way! ❤️",
    "Proud of all the progress you're making! 🎉",
    "Remember, you're stronger than you think! 💪",
    "Sending you positive energy for today! ✨"
  ];

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      await sendMessage(userId, newMessage.trim(), 'general');
      setNewMessage('');
      setSelectedTemplate('');
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const useTemplate = (template: string) => {
    setNewMessage(template);
    setSelectedTemplate(template);
  };

  // Filter messages for this specific user
  const userMessages = messages.filter(msg => 
    msg.user_id === userId || msg.recipient_user_id === userId
  );

  return (
    <div className="space-y-6">
      {/* Send Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Send a Message to {supportedUserName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Templates */}
          <div>
            <h4 className="text-sm font-medium mb-2">Quick Messages:</h4>
            <div className="grid gap-2 md:grid-cols-2">
              {messageTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-2 text-xs"
                  onClick={() => useTemplate(template)}
                >
                  {template}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Custom Message */}
          <div>
            <Textarea
              placeholder="Write your own message of support..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {newMessage.length}/500 characters
              </span>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Message History</span>
            {unreadCount > 0 && (
              <Badge variant="default">{unreadCount} unread</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : userMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No messages yet</h3>
              <p className="text-sm text-muted-foreground">
                Start the conversation by sending your first message of support!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userMessages.map((message) => (
                <div 
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.sender_member_id ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium">
                      {message.sender_member_id ? 'You' : supportedUserName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(message.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm">{message.message_text}</p>
                  {!message.is_read && !message.sender_member_id && (
                    <Badge variant="secondary" className="mt-1 text-xs">New</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Tips for Supportive Messaging
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Celebrate their progress, no matter how small</span>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Ask how they're feeling rather than assuming</span>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Offer specific help when appropriate</span>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Be patient and understanding</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
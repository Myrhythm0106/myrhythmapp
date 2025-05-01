
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Heart, Send, MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Message {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  content: string;
  time: string;
  likes: number;
  type: 'message' | 'encouragement';
}

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

  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState<'all' | 'messages' | 'encouragement'>('all');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        user: {
          name: "You",
          initials: "Y",
        },
        content: newMessage,
        time: "Just now",
        likes: 0,
        type: 'message',
      };
      setMessages([message, ...messages]);
      setNewMessage("");
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

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(message => message.type === filter);

  return (
    <div className="space-y-6">
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
            <Card key={message.id}>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.user.avatar} />
                    <AvatarFallback>{message.user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-sm">{message.user.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{message.time}</span>
                  </div>
                </div>

                {message.user.name === "You" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => console.log("Edit")}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteMessage(message.id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CardHeader>
              <CardContent className="py-2 px-4">
                <p className={message.type === 'encouragement' ? 'italic text-primary' : ''}>
                  {message.content}
                </p>
              </CardContent>
              <CardFooter className="py-2 px-4 flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => likeMessage(message.id)}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  {message.likes > 0 && message.likes}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

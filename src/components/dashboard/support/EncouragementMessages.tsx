import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, MessageSquare, Clock } from "lucide-react";

interface EncouragementMessage {
  id: string;
  message: string;
  senderName: string;
  senderRelationship: string;
  timestamp: string;
  type: 'celebration' | 'encouragement' | 'milestone' | 'check-in';
}

interface EncouragementMessagesProps {
  messages: EncouragementMessage[];
  showAll?: boolean;
}

export function EncouragementMessages({ 
  messages = [], 
  showAll = false 
}: EncouragementMessagesProps) {
  const displayMessages = showAll ? messages : messages.slice(0, 2);
  
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'celebration': return <Sparkles className="h-4 w-4 text-yellow-500" />;
      case 'milestone': return <Heart className="h-4 w-4 text-pink-500" />;
      default: return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'celebration': return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 'milestone': return 'from-pink-50 to-rose-50 border-pink-200';
      case 'encouragement': return 'from-green-50 to-emerald-50 border-green-200';
      default: return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  if (messages.length === 0) {
    return (
      <Card className="border-emerald-200/50 bg-gradient-to-r from-emerald-50/30 to-teal-50/30">
        <CardContent className="p-4 text-center">
          <div className="space-y-3">
            <div className="p-3 bg-emerald-100 rounded-full w-fit mx-auto">
              <Heart className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-emerald-800">Encouragement Coming Soon</h3>
              <p className="text-sm text-emerald-600 mt-1">
                Your support circle will share encouragement and celebrate your progress here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {displayMessages.map((message) => (
        <Card 
          key={message.id} 
          className={`bg-gradient-to-r ${getMessageColor(message.type)} border-l-4 shadow-sm hover:shadow-md transition-shadow`}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getMessageIcon(message.type)}
                  <Badge variant="outline" className="text-xs">
                    {message.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {message.timestamp}
                </div>
              </div>
              
              <blockquote className="text-sm italic text-slate-700 border-l-2 border-slate-300 pl-3">
                "{message.message}"
              </blockquote>
              
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">
                  — {message.senderName}
                </span>
                <span className="text-slate-500">
                  {message.senderRelationship}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {!showAll && messages.length > 2 && (
        <div className="text-center">
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            View {messages.length - 2} more messages
          </button>
        </div>
      )}
    </div>
  );
}
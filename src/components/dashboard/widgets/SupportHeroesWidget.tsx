
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Heart, Bell } from "lucide-react";

export function SupportHeroesWidget() {
  // Mock support team data - would come from context in production
  const supportTeam = [
    { 
      id: 1, 
      name: "Dr. Sarah", 
      role: "Doctor", 
      avatar: "👩‍⚕️", 
      lastMessage: "Great progress this week!",
      unreadCount: 1,
      online: true
    },
    { 
      id: 2, 
      name: "Mom", 
      role: "Family", 
      avatar: "👩", 
      lastMessage: "Proud of you! ❤️",
      unreadCount: 0,
      online: true
    },
    { 
      id: 3, 
      name: "Coach Mike", 
      role: "Therapist", 
      avatar: "👨‍💼", 
      lastMessage: "Let's work on tomorrow's goals",
      unreadCount: 2,
      online: false
    },
    { 
      id: 4, 
      name: "Best Friend Amy", 
      role: "Friend", 
      avatar: "👩‍🦰", 
      lastMessage: "Coffee tomorrow? ☕",
      unreadCount: 0,
      online: true
    }
  ];

  const totalUnread = supportTeam.reduce((sum, member) => sum + member.unreadCount, 0);

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-blue-600" />
            Your Support Heroes
          </CardTitle>
          {totalUnread > 0 && (
            <Badge className="bg-red-500 text-white">
              {totalUnread} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-3 bg-white/60 rounded-xl">
          <p className="text-sm font-medium text-blue-800">
            🦸‍♀️ {supportTeam.length} amazing people believe in you! 🦸‍♂️
          </p>
        </div>

        <div className="space-y-3">
          {supportTeam.slice(0, 3).map((member) => (
            <div 
              key={member.id}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100 hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>
                {member.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 truncate">{member.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {member.role}
                  </Badge>
                  {member.unreadCount > 0 && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{member.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => window.location.href = '/community'}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
            onClick={() => window.location.href = '/accountability'}
          >
            <Bell className="h-4 w-4 mr-2" />
            Updates
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Your support team is always here for you 💙
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

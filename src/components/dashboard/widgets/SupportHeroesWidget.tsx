
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Heart, Bell, Shield } from "lucide-react";

export function SupportHeroesWidget() {
  // Support team data - would come from context in production
  const supportTeam = [
    { 
      id: 1, 
      name: "Sarah Chen", 
      role: "Care Team", 
      avatar: "👩‍💼", 
      lastMessage: "Great progress this week",
      unreadCount: 1,
      online: true,
      specialty: "Care Support"
    },
    { 
      id: 2, 
      name: "Primary Caregiver", 
      role: "Family Support", 
      avatar: "👨‍👩‍👧‍👦", 
      lastMessage: "Very proud of your achievements",
      unreadCount: 0,
      online: true,
      specialty: "Care Coordination"
    },
    { 
      id: 3, 
      name: "Michael Torres", 
      role: "Therapist", 
      avatar: "👨‍💼", 
      lastMessage: "Let's review tomorrow's objectives",
      unreadCount: 2,
      online: false,
      specialty: "Cognitive Therapy"
    },
    { 
      id: 4, 
      name: "Support Coordinator", 
      role: "Case Manager", 
      avatar: "👩‍💼", 
      lastMessage: "Insurance update completed",
      unreadCount: 0,
      online: true,
      specialty: "Care Management"
    }
  ];

  const totalUnread = supportTeam.reduce((sum, member) => sum + member.unreadCount, 0);

  return (
    <Card className="border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            Your Support Circle
          </CardTitle>
          {totalUnread > 0 && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-3 py-1">
              {totalUnread} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <p className="font-semibold text-indigo-800">
              {supportTeam.length} Support Members Connected
            </p>
          </div>
          <p className="text-sm text-indigo-600">
            Optional. Share only what you choose. Not medical advice.
          </p>
        </div>

        <div className="space-y-4">
          {supportTeam.slice(0, 3).map((member) => (
            <div 
              key={member.id}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-200 hover:border-slate-300"
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                  {member.avatar}
                </div>
                {member.online && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900 truncate">{member.name}</h4>
                  {member.unreadCount > 0 && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                    {member.role}
                  </Badge>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">{member.specialty}</span>
                </div>
                <p className="text-sm text-slate-600 truncate">{member.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button 
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg"
            onClick={() => window.location.href = '/community'}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Connect
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
            onClick={() => window.location.href = '/accountability'}
          >
            <Bell className="h-4 w-4 mr-2" />
            Updates
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-500">
            Support network coordination (optional)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

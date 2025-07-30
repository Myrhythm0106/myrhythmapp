import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Heart, MessageCircle, Users, Shield, Bell, ChevronDown, ChevronUp } from "lucide-react";
import { useSupportCircleMessaging } from "@/hooks/use-support-circle-messaging";

interface SupportMember {
  id: string;
  name: string;
  relationship: string;
  role: 'viewer' | 'supporter' | 'medical';
  isOnline: boolean;
  lastSeen?: string;
  canReceiveAlerts: boolean;
}

interface SupportCirclePresenceProps {
  members: SupportMember[];
  onSendMessage?: (memberId: string) => void;
  onToggleAlerts?: (memberId: string) => void;
}

export function SupportCirclePresence({ 
  members = [], 
  onSendMessage = () => {},
  onToggleAlerts = () => {}
}: SupportCirclePresenceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useSupportCircleMessaging();
  
  const activeSupporters = members.filter(m => m.role === 'supporter' || m.role === 'medical');
  const onlineCount = members.filter(m => m.isOnline).length;

  if (members.length === 0) {
    return (
      <Card className="border-emerald-200/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
        <CardContent className="p-4 text-center">
          <div className="space-y-3">
            <div className="p-3 bg-emerald-100 rounded-full w-fit mx-auto">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-emerald-800">Build Your Support Circle</h3>
              <p className="text-sm text-emerald-600 mt-1">
                Invite family, friends, or caregivers to support your journey
              </p>
            </div>
            <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
              Invite Supporters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-emerald-200/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer hover:bg-emerald-50/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Heart className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-800">Your Support Circle</h3>
                  <p className="text-sm text-emerald-600">
                    {onlineCount > 0 ? `${onlineCount} online` : 'Supporting you always'}
                    {unreadCount > 0 && ` • ${unreadCount} unread`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                  {members.length} {members.length === 1 ? 'Supporter' : 'Supporters'}
                </Badge>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-emerald-600" />
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 px-4 pb-4">
            <div className="space-y-4">
              {/* Active Supporters List */}
              <div className="space-y-3">
                {activeSupporters.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-800">{member.name}</span>
                          {member.role === 'medical' && (
                            <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                              <Shield className="h-3 w-3 mr-1" />
                              Medical
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">{member.relationship}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSendMessage(member.id)}
                        className="h-8 w-8 p-0 hover:bg-emerald-50"
                      >
                        <MessageCircle className="h-4 w-4 text-emerald-600" />
                      </Button>
                      
                      {member.canReceiveAlerts && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleAlerts(member.id)}
                          className="h-8 w-8 p-0 hover:bg-emerald-50"
                        >
                          <Bell className="h-4 w-4 text-emerald-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {activeSupporters.length > 3 && (
                  <div className="text-center">
                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50">
                      View all {activeSupporters.length} supporters
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2 border-t border-emerald-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Share Progress
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Request Support
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
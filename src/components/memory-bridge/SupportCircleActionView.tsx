import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Users, 
  MessageCircle,
  Heart,
  CheckCircle,
  Calendar,
  Bell,
  Star,
  TrendingUp,
  Send
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { useAuth } from '@/hooks/useAuth';
import { useSupportCircle } from '@/hooks/use-support-circle';
import { toast } from 'sonner';

interface SupportCircleActionViewProps {
  actions: NextStepsItem[];
  onBack: () => void;
}

export function SupportCircleActionView({ actions, onBack }: SupportCircleActionViewProps) {
  const { user } = useAuth();
  const { members, addMessage } = useSupportCircle();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Filter actions that have support circle involvement
  const collaborativeActions = actions.filter(action => 
    action.assigned_watchers && action.assigned_watchers.length > 0 ||
    (action.assigned_to && action.assigned_to !== 'me')
  );

  const handleSendMessage = async (memberId: string) => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      await addMessage(memberId, message);
      setMessage('');
      toast.success('Message sent to your support circle! 💫', {
        description: 'They\'ll be notified about your progress update'
      });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const getActionsByMember = (memberId: string) => {
    return collaborativeActions.filter(action => 
      action.assigned_watchers?.includes(memberId) ||
      action.assigned_to === memberId
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'doing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Report
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-purple-800">Support Circle Collaboration</h1>
              <p className="text-sm text-purple-600">Share your journey and stay accountable together</p>
            </div>
            <div></div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4 bg-purple-50 border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {collaborativeActions.length}
          </div>
          <p className="text-sm text-purple-700">Collaborative Actions</p>
        </Card>
        <Card className="text-center p-4 bg-blue-50 border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {members.filter(m => m.permissions?.healthTracking || m.permissions?.moodTracking).length}
          </div>
          <p className="text-sm text-blue-700">Active Members</p>
        </Card>
        <Card className="text-center p-4 bg-green-50 border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {collaborativeActions.filter(a => ['completed', 'done'].includes(a.status)).length}
          </div>
          <p className="text-sm text-green-700">Completed Together</p>
        </Card>
        <Card className="text-center p-4 bg-orange-50 border-orange-200">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round((collaborativeActions.filter(a => ['completed', 'done'].includes(a.status)).length / Math.max(collaborativeActions.length, 1)) * 100)}%
          </div>
          <p className="text-sm text-orange-700">Success Rate</p>
        </Card>
      </div>

      {members.length === 0 ? (
        // No Support Circle Yet
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-purple-800">Build Your Support Circle</h3>
                <p className="text-purple-600 max-w-md mx-auto">
                  Invite family, friends, and caregivers to join your Memory Bridge journey. 
                  Share your progress and get the support you need.
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/support-circle'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Invite Your Support Circle
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Support Circle Members and Actions
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Support Circle Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Your Support Circle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {members.map(member => {
                    const memberActions = getActionsByMember(member.id);
                    return (
                      <Card 
                        key={member.id} 
                        className={`p-4 cursor-pointer transition-all ${
                          selectedMember === member.id 
                            ? 'border-purple-300 bg-purple-50' 
                            : 'hover:border-purple-200 hover:bg-purple-25'
                        }`}
                        onClick={() => setSelectedMember(member.id)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-purple-800">{member.name}</h4>
                              <p className="text-sm text-purple-600">Support Circle Member</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                Member
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-purple-600">
                                {memberActions.length}
                              </div>
                              <p className="text-xs text-purple-500">shared actions</p>
                            </div>
                          </div>
                          
                          {memberActions.length > 0 && (
                            <div className="flex gap-1">
                              {memberActions.slice(0, 3).map(action => (
                                <div 
                                  key={action.id}
                                  className={`w-3 h-3 rounded-full ${
                                    ['completed', 'done'].includes(action.status) 
                                      ? 'bg-green-400' 
                                      : ['doing', 'in_progress'].includes(action.status)
                                      ? 'bg-blue-400'
                                      : 'bg-gray-300'
                                  }`}
                                  title={action.action_text}
                                />
                              ))}
                              {memberActions.length > 3 && (
                                <div className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-600">+</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Selected Member Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                {selectedMember ? 
                  `Collaborate with ${members.find(m => m.id === selectedMember)?.name}` : 
                  'Select a Member'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMember ? (
                <div className="space-y-4">
                  {/* Member's Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Shared Actions</h4>
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {getActionsByMember(selectedMember).map(action => (
                          <Card key={action.id} className="p-3 border-l-4 border-l-purple-200">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium leading-tight">
                                  {action.action_text}
                                </p>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getStatusColor(action.status)}`}
                                >
                                  {action.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  {action.assigned_to === selectedMember ? (
                                    <span className="text-blue-600">Assigned to them</span>
                                  ) : (
                                    <span className="text-purple-600">Watching progress</span>
                                  )}
                                </div>
                                
                                {action.scheduled_date && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(action.scheduled_date).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Send Message */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium text-sm">Send Progress Update</h4>
                    <Textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Share an update with ${members.find(m => m.id === selectedMember)?.name}...`}
                      className="min-h-[80px]"
                    />
                    <Button 
                      onClick={() => handleSendMessage(selectedMember)}
                      disabled={!message.trim() || isSending}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSending ? 'Sending...' : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Update
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a support circle member to view shared actions and send updates</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Collaborative Actions */}
      {collaborativeActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              All Collaborative Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collaborativeActions.map(action => (
                  <Card key={action.id} className="p-4 border-l-4 border-l-yellow-200">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">
                          {action.action_text}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(action.status)}`}
                        >
                          {action.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        {action.assigned_to && action.assigned_to !== 'me' && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <Users className="h-3 w-3" />
                            Assigned to {action.assigned_to}
                          </div>
                        )}
                        
                        {action.assigned_watchers && action.assigned_watchers.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-purple-600">
                            <Bell className="h-3 w-3" />
                            {action.assigned_watchers.length} watchers
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
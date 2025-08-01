import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { useAuth } from '@/contexts/AuthContext';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { Users, MessageCircle, Heart, Phone, Share2, UserPlus, Bell } from 'lucide-react';

interface FamilyMember {
  id: string;
  user_id: string;
  family_member_id: string;
  relationship: string;
  display_name: string;
  contact_info?: {
    email?: string;
    phone?: string;
  };
  notification_preferences: {
    commitment_reminders: boolean;
    crisis_alerts: boolean;
    progress_updates: boolean;
  };
  access_level: 'view_only' | 'interactive' | 'admin';
  shared_commitments: string[];
  watchers: string[];
}

export function MobileFamilyIntegration() {
  const { user } = useAuth();
  const { extractedActions, fetchExtractedActions } = useMemoryBridge();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    fetchExtractedActions();
    // Demo family members
    setFamilyMembers([
      {
        id: 'family-1',
        user_id: user?.id || 'demo-user',
        family_member_id: 'sarah-123',
        relationship: 'spouse',
        display_name: 'Sarah',
        contact_info: {
          email: 'sarah@example.com',
          phone: '+1234567890'
        },
        notification_preferences: {
          commitment_reminders: true,
          crisis_alerts: true,
          progress_updates: true
        },
        access_level: 'interactive',
        shared_commitments: ['demo-action-1', 'demo-action-3'],
        watchers: ['demo-user']
      },
      {
        id: 'family-2',
        user_id: user?.id || 'demo-user',
        family_member_id: 'mom-456',
        relationship: 'parent',
        display_name: 'Mom',
        contact_info: {
          email: 'mom@example.com',
          phone: '+0987654321'
        },
        notification_preferences: {
          commitment_reminders: false,
          crisis_alerts: true,
          progress_updates: true
        },
        access_level: 'view_only',
        shared_commitments: ['demo-action-2'],
        watchers: ['demo-user']
      }
    ]);
  }, [user?.id, fetchExtractedActions]);

  const handleContactMember = (member: FamilyMember) => {
    console.log('Contacting member:', member.display_name);
    // Implement contact functionality
  };

  const handleShareUpdate = (member: FamilyMember) => {
    console.log('Sharing update with:', member.display_name);
    // Implement share functionality
  };

  if (familyMembers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Family Members</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with family members to share commitments and get support.
            </p>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Family Member
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-blue-900">Family Support Circle</h2>
        <p className="text-sm text-muted-foreground">Share your journey with loved ones</p>
      </div>

      {familyMembers.map((member) => (
        <SwipeableContainer
          key={member.id}
          onSwipeLeft={{
            label: 'Contact',
            icon: <Phone className="h-4 w-4" />,
            color: '#3b82f6',
            action: () => handleContactMember(member)
          }}
          onSwipeRight={{
            label: 'Share',
            icon: <Share2 className="h-4 w-4" />,
            color: '#10b981',
            action: () => handleShareUpdate(member)
          }}
          enableHorizontalSwipe={true}
          className="rounded-lg"
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {member.display_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{member.display_name}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">{member.relationship}</p>
                  </div>
                </div>
                <Badge
                  variant={member.access_level === 'admin' ? 'default' : 
                          member.access_level === 'interactive' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {member.access_level.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-red-500" />
                  <span className="text-muted-foreground">Shared:</span>
                  <span className="font-medium">{member.shared_commitments.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bell className="h-3 w-3 text-blue-500" />
                  <span className="text-muted-foreground">Alerts:</span>
                  <span className="font-medium">
                    {member.notification_preferences.crisis_alerts ? 'On' : 'Off'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground font-medium">Notifications:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.notification_preferences.commitment_reminders && (
                      <Badge variant="outline" className="text-xs">Reminders</Badge>
                    )}
                    {member.notification_preferences.crisis_alerts && (
                      <Badge variant="outline" className="text-xs">Crisis</Badge>
                    )}
                    {member.notification_preferences.progress_updates && (
                      <Badge variant="outline" className="text-xs">Progress</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleContactMember(member)}
                  className="flex-1"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Message
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleShareUpdate(member)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Share Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </SwipeableContainer>
      ))}

      <div className="bg-blue-50 rounded-lg p-3 text-center">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Swipe left to contact or right to share updates
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200">
        <CardContent className="pt-4">
          <div className="text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold text-blue-900 mb-1">Family Insights</h3>
            <p className="text-sm text-blue-700">
              Your family is watching {extractedActions.filter(a => a.status === 'pending').length} commitments
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
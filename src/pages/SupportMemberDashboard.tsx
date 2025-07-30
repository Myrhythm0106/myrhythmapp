import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Calendar, 
  MessageCircle, 
  Activity, 
  Shield,
  User,
  ArrowLeft
} from 'lucide-react';
import { useSupportMemberRole } from '@/hooks/use-support-member-role';
import { SupportMemberActions } from '@/components/support-member/SupportMemberActions';
import { SupportMemberMessages } from '@/components/support-member/SupportMemberMessages';
import { useAuth } from '@/contexts/AuthContext';

export default function SupportMemberDashboard() {
  const { signOut } = useAuth();
  const { supportedUsers, isLoading } = useSupportMemberRole();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'messages'>('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const selectedUser = supportedUsers.find(u => u.id === selectedUserId);

  // User selection view
  if (!selectedUserId && supportedUsers.length > 1) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Support Circle</h1>
            <Button onClick={signOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Who would you like to support today?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {supportedUsers.map((user) => (
                  <Card 
                    key={user.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-medium">{user.supportedUserName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Your {user.relationship}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">{user.role}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Auto-select if only one user
  const currentUser = selectedUser || supportedUsers[0];
  const currentUserId = selectedUserId || supportedUsers[0]?.id;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Active Support Roles</h2>
            <p className="text-muted-foreground mb-4">
              You don't currently have any active support circle memberships.
            </p>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {supportedUsers.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUserId(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h1 className="text-xl font-bold">Supporting {currentUser.supportedUserName}</h1>
                <p className="text-sm text-muted-foreground">
                  Your {currentUser.relationship} • {currentUser.role}
                </p>
              </div>
            </div>
            <Button onClick={signOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'actions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Activities
              </div>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'messages'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Messages
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the Support Circle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  You're here to support {currentUser.supportedUserName} on their wellness journey. 
                  Here's what you can do:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">View Activities</h4>
                      <p className="text-sm text-muted-foreground">
                        See their daily actions and provide encouragement
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Send Messages</h4>
                      <p className="text-sm text-muted-foreground">
                        Offer support and celebrate their progress
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentUser.permissions?.calendar && (
                      <Badge variant="secondary">Calendar Access</Badge>
                    )}
                    {currentUser.permissions?.goals && (
                      <Badge variant="secondary">Goals Access</Badge>
                    )}
                    {currentUser.permissions?.mood_tracking && (
                      <Badge variant="secondary">Mood Tracking</Badge>
                    )}
                    {currentUser.permissions?.health_tracking && (
                      <Badge variant="secondary">Health Tracking</Badge>
                    )}
                    {!Object.values(currentUser.permissions || {}).some(Boolean) && (
                      <p className="text-sm text-muted-foreground">
                        Limited access - you can send messages and receive updates
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('messages')}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Encouragement
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('actions')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Check Today's Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <SupportMemberActions 
            userId={currentUserId} 
            permissions={currentUser.permissions}
          />
        )}

        {activeTab === 'messages' && (
          <SupportMemberMessages 
            userId={currentUserId}
            supportedUserName={currentUser.supportedUserName}
          />
        )}
      </div>
    </div>
  );
}
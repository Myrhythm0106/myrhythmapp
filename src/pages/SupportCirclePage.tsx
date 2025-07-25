import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportCircleManager } from "@/components/accountability/SupportCircleManager";
import { SupportCircleMessages } from "@/components/personal-community/SupportCircleMessages";
import { SupportCirclePermissions } from "@/components/personal-community/SupportCirclePermissions";
import { useAccountabilitySystem } from "@/hooks/use-accountability-system";
import { 
  Users, 
  MessageCircle, 
  Settings, 
  Shield,
  Plus,
  Bell,
  Heart
} from 'lucide-react';

const SupportCirclePage = () => {
  const { supportCircle, isLoading } = useAccountabilitySystem();
  
  const activeMembers = supportCircle.filter(m => m.status === 'active');
  const pendingMembers = supportCircle.filter(m => m.status === 'pending');

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-600">Loading your support circle...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Support Circle
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with family, friends, and caregivers who help you stay on track with your brain health journey.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{activeMembers.length}</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{pendingMembers.length}</div>
            <div className="text-sm text-muted-foreground">Pending Invites</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Recent Messages</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm text-muted-foreground">Privacy Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <SupportCircleManager />
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <SupportCircleMessages />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <SupportCirclePermissions />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Circle Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically notify your support circle about milestones and concerns
                  </p>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Emergency contacts</h3>
                  <p className="text-sm text-muted-foreground">
                    Designate members who should be contacted in emergencies
                  </p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Privacy level</h3>
                  <p className="text-sm text-muted-foreground">
                    Control what information is shared with your support circle
                  </p>
                </div>
                <Badge variant="outline">Selective</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Notice */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Safety Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 text-sm">
            Your support circle members can only see the information you explicitly allow them to access. 
            You can modify permissions at any time. In case of emergency, designated contacts may receive 
            additional notifications to ensure your safety.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportCirclePage;
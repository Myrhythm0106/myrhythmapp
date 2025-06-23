
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CommunityMembers } from "@/components/community/CommunityMembers";
import { CommunityInvite } from "@/components/community/CommunityInvite";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Users, MessageSquare, Heart, ChevronRight, Eye, Settings } from "lucide-react";
import { SwipeableCarousel } from "@/components/dashboard/SwipeableCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { EnhancedSupportCirclePermissions } from "@/components/personal-community/EnhancedSupportCirclePermissions";
import { SupportCircleMessaging } from "@/components/personal-community/SupportCircleMessaging";

const PersonalCommunity = () => {
  const [activeTab, setActiveTab] = useState("members");
  const isMobile = useIsMobile();

  // These members should come from your MembersList component
  const communityMembers = [
    { 
      id: "1", 
      name: "Sarah Johnson", 
      permissions: { 
        calendar: false, 
        mood: false, 
        symptoms: false, 
        goals: false, 
        gratitude: false, 
        voice_recordings: false 
      } 
    },
    { 
      id: "2", 
      name: "Michael Smith", 
      permissions: { 
        calendar: true, 
        mood: false, 
        symptoms: false, 
        goals: false, 
        gratitude: false, 
        voice_recordings: false 
      } 
    },
    { 
      id: "3", 
      name: "Dr. Smith", 
      permissions: { 
        calendar: true, 
        mood: true, 
        symptoms: true, 
        goals: true, 
        gratitude: false, 
        voice_recordings: true 
      } 
    },
    { 
      id: "4", 
      name: "Mom", 
      permissions: { 
        calendar: false, 
        mood: false, 
        symptoms: false, 
        goals: false, 
        gratitude: true, 
        voice_recordings: false 
      } 
    }
  ];

  const handleUpdateMemberPermissions = (memberId: string, permissions: any) => {
    console.log('Updating permissions for member:', memberId, permissions);
    // In a real app, this would update the database
  };

  const encouragementItems = communityMembers.map((member) => (
    <Card key={member.id} className="p-4 h-full">
      <h4 className="font-medium">{member.name}</h4>
      <div className="mt-2 space-y-2">
        <Input placeholder="Write a note..." />
        <Button className="w-full">
          <Heart className="mr-1 h-4 w-4" />
          Send Encouragement
        </Button>
      </div>
    </Card>
  ));

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="space-y-6 p-4">
        <PageHeader 
          title="My Support Circle" 
          subtitle="Connect, communicate, and share your journey with your trusted support network"
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                Invite New Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Invite to Your Support Circle</DialogTitle>
              </DialogHeader>
              <CommunityInvite />
            </DialogContent>
          </Dialog>
        </PageHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex w-full overflow-x-auto">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="messaging" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Access Control
            </TabsTrigger>
            <TabsTrigger value="encouragement" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Encouragement
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Input 
                    placeholder="Search members..." 
                    className="max-w-sm" 
                    aria-label="Search community members"
                  />
                </div>
                <CommunityMembers />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messaging" className="space-y-4">
            <SupportCircleMessaging />
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4">
            <div className="space-y-4">
              {communityMembers.map((member) => (
                <EnhancedSupportCirclePermissions
                  key={member.id}
                  member={member}
                  onUpdate={handleUpdateMemberPermissions}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="encouragement" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Send Encouragement</h3>
                  <p className="text-muted-foreground">
                    Send notes of encouragement to your support circle members
                  </p>
                </div>
                
                {isMobile ? (
                  <SwipeableCarousel items={encouragementItems} />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {encouragementItems}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default PersonalCommunity;

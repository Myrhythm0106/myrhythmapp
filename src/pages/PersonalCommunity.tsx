
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CommunityMembers } from "@/components/community/CommunityMembers";
import { MessageBoard } from "@/components/community/MessageBoard";
import { CommunityInvite } from "@/components/community/CommunityInvite";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Users, MessageSquare, Heart, ChevronRight } from "lucide-react";
import { SwipeableCarousel } from "@/components/dashboard/SwipeableCarousel";
import { useIsMobile } from "@/hooks/use-mobile";

const PersonalCommunity = () => {
  const [activeTab, setActiveTab] = useState("members");
  const isMobile = useIsMobile();

  // These members should come from your MembersList component
  const communityMembers = [
    { name: "Sarah Johnson", id: "1" },
    { name: "Michael Smith", id: "2" },
    { name: "Dr. Smith", id: "3" },
    { name: "Mom", id: "4" }
  ];

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
          title="My Support" 
          subtitle="Connect with your support network of family, friends, and caregivers"
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
                <DialogTitle>Invite to Your Support Network</DialogTitle>
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
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message Board
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
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <MessageBoard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="encouragement" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Send Encouragement</h3>
                  <p className="text-muted-foreground">
                    Send notes of encouragement to your community members
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

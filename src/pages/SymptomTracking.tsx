
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SymptomTracker } from "@/components/dashboard/SymptomTracker";
import { SymptomLogForm } from "@/components/tracking/SymptomLogForm";
import { SymptomHistory } from "@/components/tracking/SymptomHistory";
import { SymptomInsights } from "@/components/tracking/SymptomInsights";
import { InspirationSection } from "@/components/tracking/InspirationSection";
import { BrainGamesLibrary } from "@/components/brain-games/BrainGamesLibrary";
import { Plus, List, LineChart, Smile, Brain, Eye, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupportCircle } from "@/hooks/use-support-circle";
import { toast } from "sonner";

const SymptomTracking = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { members } = useSupportCircle();
  
  // Get the number of support circle members with health tracking access
  const membersWithAccess = members.filter(member => member.permissions.healthTracking).length;

  // Function to show sharing permissions dialog
  const handleShowSharingDialog = () => {
    if (membersWithAccess > 0) {
      toast.success(`Your health data is shared with ${membersWithAccess} support circle member${membersWithAccess > 1 ? 's' : ''}`, {
        description: "You can manage sharing permissions in My Support Circle."
      });
    } else {
      toast("No sharing permissions set", {
        description: "Visit My Support Circle to grant access to your health data."
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Health and Fitness Tracking" 
        subtitle="Monitor health metrics and identify patterns over time"
      >
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={() => setActiveTab("log")}
            className="bg-gradient-to-r from-primary to-primary/80 text-white font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="mr-1 h-4 w-4" />
            Log Health Data
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleShowSharingDialog}
          >
            <Eye className="h-4 w-4" />
            {membersWithAccess > 0 ? (
              <span>Shared with {membersWithAccess} {membersWithAccess === 1 ? 'member' : 'members'}</span>
            ) : (
              <span>Not shared</span>
            )}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Manage Access</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Support Circle Access</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Card>
                  <CardContent className="pt-6">
                    {members.length > 0 ? (
                      <div className="space-y-4">
                        {members.map(member => (
                          <div key={member.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                              <p className="font-medium">{member.name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex gap-2 items-center">
                                <span className="text-sm">Health access:</span>
                                <span className={`text-sm font-medium ${
                                  member.permissions.healthTracking ? "text-green-600" : "text-red-600"
                                }`}>
                                  {member.permissions.healthTracking ? "Yes" : "No"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="mt-4">
                          <Button asChild className="w-full">
                            <a href="/personal-community">Manage Permissions</a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Users className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="font-medium">No support circle members</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add members to your support circle to share your health data.
                        </p>
                        <Button asChild>
                          <a href="/personal-community">Add Members</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="overflow-x-auto flex w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="log">Log Data</TabsTrigger>
          <TabsTrigger value="brainGames">Brain Games Library</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <SymptomTracker />
        </TabsContent>
        
        <TabsContent value="log">
          <Card>
            <CardContent className="pt-6">
              <SymptomLogForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="brainGames">
          <Card className="overflow-hidden">
            <CardContent className="pt-6 pb-6">
              <BrainGamesLibrary />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <SymptomHistory />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardContent className="pt-6">
              <SymptomInsights />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inspiration">
          <InspirationSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SymptomTracking;


import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CommunityPost } from "@/components/community/CommunityPost";
import { CommunityGroup } from "@/components/community/CommunityGroup";
import { SearchResults } from "@/components/community/SearchResults";
import { ExpertQA } from "@/components/community/ExpertQA";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewPostForm } from "@/components/community/NewPostForm";
import { Users, MessageSquare, Search, Plus, User, Heart } from "lucide-react";

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Community" 
        subtitle="Connect with others, share experiences, and find support"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <NewPostForm />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search posts, topics, or members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <Tabs defaultValue="support-circle" className="space-y-4">
        <TabsList>
          <TabsTrigger value="support-circle" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            My Support Circle
          </TabsTrigger>
          <TabsTrigger value="expert-qa" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Expert Q&A
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Discussions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="support-circle" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">My Support Circle</h3>
                <p className="text-muted-foreground">
                  Connect with your personal support network of family, friends, and caregivers
                </p>
              </div>
              <div className="flex justify-center mb-4">
                <Button asChild variant="outline">
                  <a href="/personal-community" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Go to My Support Circle
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expert-qa">
          <Card>
            <CardContent className="pt-6">
              <ExpertQA />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CommunityGroup 
              name="TBI Survivors"
              description="A supportive community for individuals recovering from traumatic brain injuries."
              memberCount={126}
              image="/placeholder.svg"
            />
            
            <CommunityGroup 
              name="Caregivers Support"
              description="Connect with others caring for loved ones with brain injuries or mental health conditions."
              memberCount={94}
              image="/placeholder.svg"
            />
            
            <CommunityGroup 
              name="Young Adults with Brain Injuries"
              description="A group for people under 40 navigating life after brain injury."
              memberCount={58}
              image="/placeholder.svg"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="discussions" className="space-y-6">
          {searchQuery ? (
            <SearchResults query={searchQuery} />
          ) : (
            <>
              <CommunityPost 
                id="1"
                user={{
                  name: "Alex Johnson",
                  avatar: undefined,
                  initials: "AJ"
                }}
                topic="TBI Support"
                title="Has anyone tried cognitive therapy with Dr. Williams at Dallas Neuro?"
                content="I've been dealing with memory issues since my injury last year, and my doctor recommended Dr. Williams. I'd love to hear from anyone who has experience with their cognitive therapy program."
                comments={5}
                time="2h ago"
              />
              
              <CommunityPost 
                id="2"
                user={{
                  name: "Morgan Lee",
                  avatar: undefined,
                  initials: "ML"
                }}
                topic="Caregivers Corner"
                title="Looking for respite care options in North Dallas"
                content="I've been caring for my partner who had a stroke 6 months ago. I'm looking for trustworthy respite care options in the North Dallas area so I can take a short break. Any recommendations would be greatly appreciated."
                comments={3}
                time="5h ago"
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;

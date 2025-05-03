
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, HelpCircle, Youtube, FileText } from "lucide-react";
import { UserGuides } from './UserGuides';
import { FAQContent } from './FAQContent';
import { TutorialVideos } from './TutorialVideos';
import { TermsPolicies } from './TermsPolicies';

export const UsefulInfoTabs = () => {
  return (
    <Tabs defaultValue="guides" className="space-y-4">
      <TabsList className="w-full flex justify-between md:justify-start space-x-2">
        <TabsTrigger value="guides" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden md:inline">User Guides</span>
          <span className="md:hidden">Guides</span>
        </TabsTrigger>
        <TabsTrigger value="faq" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden md:inline">Frequently Asked Questions</span>
          <span className="md:hidden">FAQ</span>
        </TabsTrigger>
        <TabsTrigger value="videos" className="flex items-center gap-2">
          <Youtube className="h-4 w-4" />
          <span className="hidden md:inline">Tutorial Videos</span>
          <span className="md:hidden">Videos</span>
        </TabsTrigger>
        <TabsTrigger value="terms" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden md:inline">Terms & Privacy</span>
          <span className="md:hidden">Terms</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="guides" className="space-y-4">
        <UserGuides />
      </TabsContent>
      
      <TabsContent value="faq" className="space-y-4">
        <FAQContent />
      </TabsContent>
      
      <TabsContent value="videos" className="space-y-4">
        <TutorialVideos />
      </TabsContent>
      
      <TabsContent value="terms" className="space-y-4">
        <TermsPolicies />
      </TabsContent>
    </Tabs>
  );
};

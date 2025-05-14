
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HeartHandshake, BarChart2, Book, Plus } from "lucide-react";
import { GratitudeDashboard } from "@/components/gratitude/GratitudeDashboard";
import { GratitudePrompt } from "@/components/gratitude/GratitudePrompt";
import { GratitudeJournal } from "@/components/gratitude/GratitudeJournal";
import { useGratitude } from "@/hooks/use-gratitude";
import { Card, CardContent } from "@/components/ui/card";
import { GratitudeEntryCard } from "@/components/gratitude/journal/GratitudeEntryCard";

const Gratitude = () => {
  const [activeTab, setActiveTab] = useState("journal");
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [promptType, setPromptType] = useState<"fitness" | "mindfulness" | "social" | "general">("general");
  const { entries, addEntry } = useGratitude();
  const [latestEntry, setLatestEntry] = useState<any>(null);
  const [showLatestEntry, setShowLatestEntry] = useState(false);
  
  // When the component mounts or entries change, check if we have entries
  useEffect(() => {
    if (entries.length > 0) {
      setLatestEntry(entries[0]);
    }
  }, [entries]);
  
  const handleOpenPrompt = (type: "fitness" | "mindfulness" | "social" | "general") => {
    setPromptType(type);
    setIsPromptOpen(true);
  };
  
  const handleSaveGratitude = (entry: any) => {
    addEntry(entry);
    setIsPromptOpen(false);
    setLatestEntry(entry);
    setShowLatestEntry(true);
    // Auto-switch to journal tab when entry is saved
    setActiveTab("journal");
  };
  
  // Handle actions on the latest entry
  const handleSelectLatestEntry = () => {
    // This would be implemented in the journal component
    setShowLatestEntry(false);
  };
  
  const handleShareLatestEntry = () => {
    // This would be implemented in the journal component
    setShowLatestEntry(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Contextual Gratitude" 
        subtitle="Track, reflect, and grow through intentional gratitude"
      >
        <Button onClick={() => handleOpenPrompt("general")}>
          <Plus className="mr-1 h-4 w-4" />
          Add Gratitude
        </Button>
      </PageHeader>
      
      <Card className="bg-muted/20">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="outline" 
              className="flex-1 min-w-[120px] bg-background"
              onClick={() => handleOpenPrompt("fitness")}
            >
              <HeartHandshake className="mr-2 h-5 w-5 text-blue-500" />
              Fitness Gratitude
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 min-w-[120px] bg-background"
              onClick={() => handleOpenPrompt("mindfulness")}
            >
              <HeartHandshake className="mr-2 h-5 w-5 text-green-500" />
              Mindfulness Gratitude
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 min-w-[120px] bg-background"
              onClick={() => handleOpenPrompt("social")}
            >
              <HeartHandshake className="mr-2 h-5 w-5 text-purple-500" />
              Social Gratitude
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Show the latest entry immediately after saving */}
      {showLatestEntry && latestEntry && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            Your Latest Gratitude Entry
          </h3>
          <GratitudeEntryCard 
            entry={latestEntry} 
            onSelectEntry={handleSelectLatestEntry}
            onShareEntry={handleShareLatestEntry}
          />
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowLatestEntry(false)}>
              Dismiss
            </Button>
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="journal" className="flex-1">
            <Book className="h-4 w-4 mr-2" />
            Gratitude Journal
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1">
            <BarChart2 className="h-4 w-4 mr-2" />
            Insights Dashboard
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="journal" className="space-y-4">
          <GratitudeJournal />
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <GratitudeDashboard />
        </TabsContent>
      </Tabs>
      
      {/* Gratitude Prompt Dialog */}
      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent className="max-w-lg">
          <GratitudePrompt 
            promptType={promptType}
            onSave={handleSaveGratitude}
            onClose={() => setIsPromptOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gratitude;

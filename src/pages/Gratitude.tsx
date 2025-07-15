
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HeartHandshake, BarChart2, Book, Plus, Brain, Sparkles } from "lucide-react";
import { GratitudeDashboard } from "@/components/gratitude/GratitudeDashboard";
import { GratitudePrompt } from "@/components/gratitude/GratitudePrompt";
import { GratitudeJournal } from "@/components/gratitude/GratitudeJournal";
import { useGratitude } from "@/hooks/use-gratitude";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntryDetailsDialog } from "@/components/gratitude/journal/EntryDetailsDialog";

const Gratitude = () => {
  const [activeTab, setActiveTab] = useState("add-gratitude");
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [promptType, setPromptType] = useState<"fitness" | "mindfulness" | "social" | "general">("general");
  const { addEntry } = useGratitude();
  
  // State for the quick add dialog
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  const handleOpenPrompt = (type: "fitness" | "mindfulness" | "social" | "general") => {
    setPromptType(type);
    setIsPromptOpen(true);
  };
  
  const handleSaveGratitude = (entry: any) => {
    addEntry(entry);
    setIsPromptOpen(false);
    // Auto-switch to journal tab when entry is saved
    setActiveTab("journal");
  };
  
  const handleQuickAdd = () => {
    setIsQuickAddOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-500" />
            Brain Health Gratitude Practice
            <Sparkles className="h-6 w-6 text-amber-400" />
          </h1>
          <p className="text-muted-foreground mt-2">
            Strengthen neural pathways through meaningful gratitude and reflection
          </p>
        </div>
        <Button 
          onClick={handleQuickAdd} 
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="mr-2 h-5 w-5" />
          <Brain className="mr-2 h-5 w-5" />
          Add Gratitude Now
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="add-gratitude" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Gratitude
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex-1">
            <Book className="h-4 w-4 mr-2" />
            Your Journal
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1">
            <BarChart2 className="h-4 w-4 mr-2" />
            Your Patterns
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="add-gratitude" className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-rose-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-6 w-6 text-blue-500" />
                Brain Health Gratitude Practice
                <Sparkles className="h-5 w-5 text-amber-400" />
              </CardTitle>
              <p className="text-blue-700">
                Research shows that gratitude practice strengthens neural pathways and improves cognitive function. 
                The key is not just <strong>what</strong> you're grateful for, but deeply reflecting on <strong>why</strong> it matters to you.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Add Button */}
              <div className="text-center">
                <Button 
                  onClick={handleQuickAdd}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 hover:from-blue-600 hover:via-purple-600 hover:to-rose-600 text-lg px-8 py-4"
                >
                  <Brain className="h-6 w-6 mr-2" />
                  Start Your Brain Health Gratitude
                  <Sparkles className="h-5 w-5 ml-2" />
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Click to add what you're grateful for and why it matters
                </p>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Or Choose Your Gratitude Context</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select what feels right for your reflection today
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 bg-background hover:bg-blue-50 border-blue-200"
                  onClick={() => handleOpenPrompt("fitness")}
                >
                  <div className="text-center">
                    <HeartHandshake className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <span className="font-medium">After Exercise</span>
                    <p className="text-xs text-muted-foreground">Reflect on physical activity</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 bg-background hover:bg-green-50 border-green-200"
                  onClick={() => handleOpenPrompt("mindfulness")}
                >
                  <div className="text-center">
                    <HeartHandshake className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <span className="font-medium">Quiet Moments</span>
                    <p className="text-xs text-muted-foreground">Peaceful reflection time</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 bg-background hover:bg-purple-50 border-purple-200"
                  onClick={() => handleOpenPrompt("social")}
                >
                  <div className="text-center">
                    <HeartHandshake className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <span className="font-medium">With Others</span>
                    <p className="text-xs text-muted-foreground">Social connections</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 bg-background hover:bg-amber-50 border-amber-200"
                  onClick={() => handleOpenPrompt("general")}
                >
                  <div className="text-center">
                    <HeartHandshake className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                    <span className="font-medium">General Gratitude</span>
                    <p className="text-xs text-muted-foreground">Daily appreciation</p>
                  </div>
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Why the "WHY" Matters for Your Brain</span>
                </div>
                <p className="text-sm text-blue-700">
                  When you explain <strong>why</strong> you're grateful, you engage deeper neural pathways, 
                  strengthen emotional processing, and create lasting positive mental patterns. This isn't just feel-good practice—it's brain training!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="journal" className="space-y-4">
          <GratitudeJournal />
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <GratitudeDashboard />
        </TabsContent>
      </Tabs>
      
      {/* Traditional Gratitude Prompt Dialog */}
      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent className="max-w-lg">
          <GratitudePrompt 
            promptType={promptType}
            onSave={handleSaveGratitude}
            onClose={() => setIsPromptOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Quick Add Dialog */}
      <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
        <EntryDetailsDialog
          isNewEntry={true}
          onClose={() => setIsQuickAddOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default Gratitude;

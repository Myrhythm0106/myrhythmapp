
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HeartHandshake, BarChart2, Book, Plus, Brain, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GratitudeDashboard } from "@/components/gratitude/GratitudeDashboard";
import { EnhancedGratitudePrompt } from "@/components/gratitude/EnhancedGratitudePrompt";
import { GratitudeJournal } from "@/components/gratitude/GratitudeJournal";
import { useGratitude } from "@/hooks/use-gratitude";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntryDetailsDialog } from "@/components/gratitude/journal/EntryDetailsDialog";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";

const Gratitude = () => {
  const [activeTab, setActiveTab] = useState("add-gratitude");
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [promptType, setPromptType] = useState<"fitness" | "mindfulness" | "social" | "general">("general");
  const { addEntry } = useGratitude();
  
  // State for the main add dialog
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  // Define sections for reading progress
  const gratitudeSections = [
    { id: 'header', title: 'Welcome & Overview' },
    { id: 'cta', title: 'Get Started' },
    { id: 'add-section', title: 'Add Gratitude' },
    { id: 'journal-section', title: 'Your Journal' },
    { id: 'insights-section', title: 'Your Patterns' }
  ];

  useEffect(() => {
    // Set up section elements for progress tracking
    setTimeout(() => {
      const sectionsWithElements = gratitudeSections.map(section => {
        const element = document.getElementById(section.id);
        return { ...section, element };
      });
      // Update sections if needed for progress tracking
    }, 100);
  }, []);
  
  const handleOpenPrompt = (type: "fitness" | "mindfulness" | "social" | "general") => {
    setPromptType(type);
    setIsPromptOpen(true);
  };
  
  const handleSaveGratitude = (entry: any) => {
    addEntry(entry);
    setIsPromptOpen(false);
    setActiveTab("journal");
  };
  
  // Function to open the main add dialog
  const handleQuickAdd = () => {
    setIsQuickAddOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgressBar sections={gratitudeSections} />
      
      <div className="p-6 pt-10">
        {/* MAIN HEADER WITH PROMINENT ADD BUTTON */}
        <div id="header" className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold flex items-center gap-3 mb-3">
              <Brain className="h-10 w-10 text-blue-500" />
              Brain Health Gratitude Practice
              <Sparkles className="h-8 w-8 text-amber-400" />
            </h1>
            <p className="text-lg text-muted-foreground">
              Strengthen neural pathways through meaningful gratitude and reflection
            </p>
          </div>
          
          {/* LARGE ADD BUTTON - ALWAYS VISIBLE */}
          <div className="flex-shrink-0">
            <Button 
              onClick={handleQuickAdd} 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-3 h-6 w-6" />
              <Brain className="mr-3 h-6 w-6" />
              ADD GRATITUDE NOW
            </Button>
          </div>
        </div>

        {/* PROMINENT CALL-TO-ACTION CARD */}
        <Card id="cta" className="bg-gradient-to-br from-blue-50 via-purple-50 to-rose-50 border-blue-200 mb-8 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-blue-800">
              <Brain className="h-8 w-8 text-blue-500" />
              Start Your Brain Health Gratitude Practice
              <Sparkles className="h-7 w-7 text-amber-400" />
            </CardTitle>
            <p className="text-blue-700 text-xl mt-3">
              Click the button below to add what you're grateful for and WHY it matters to your brain health
            </p>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <Button 
              onClick={handleQuickAdd}
              size="lg"
              className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white text-2xl px-16 py-6 font-bold shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              <Plus className="h-8 w-8 mr-4" />
              <Brain className="h-8 w-8 mr-4" />
              ADD YOUR GRATITUDE & WHY
              <Sparkles className="h-7 w-7 ml-4" />
            </Button>
            <p className="text-blue-600 mt-4 text-lg">
              🧠 The "WHY" is where the real brain health magic happens!
            </p>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full max-w-md mx-auto bg-white shadow-md">
            <TabsTrigger value="add-gratitude" className="flex-1 text-base">
              <Plus className="h-5 w-5 mr-2" />
              Add Gratitude
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex-1 text-base">
              <Book className="h-5 w-5 mr-2" />
              Your Journal
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex-1 text-base">
              <BarChart2 className="h-5 w-5 mr-2" />
              Your Patterns
            </TabsTrigger>
          </TabsList>
          
          <TabsContent id="add-section" value="add-gratitude" className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-rose-50 border-blue-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-blue-800">
                  <Brain className="h-7 w-7 text-blue-500" />
                  Brain Health Gratitude Practice
                  <Sparkles className="h-6 w-6 text-amber-400" />
                </CardTitle>
                <p className="text-blue-700 text-lg">
                  Research shows that gratitude practice strengthens neural pathways and improves cognitive function. 
                  The key is not just <strong>what</strong> you're grateful for, but deeply reflecting on <strong>why</strong> it matters to you.
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* MAIN ACTION BUTTON */}
                <div className="text-center">
                  <Button 
                    onClick={handleQuickAdd}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 hover:from-blue-600 hover:via-purple-600 hover:to-rose-600 text-white text-xl px-12 py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Brain className="h-7 w-7 mr-3" />
                    Start Your Brain Health Gratitude
                    <Sparkles className="h-6 w-6 ml-3" />
                  </Button>
                  <p className="text-blue-600 mt-3 text-lg font-medium">
                    Click to add what you're grateful for and why it matters
                  </p>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Or Choose Your Gratitude Context</h3>
                  <p className="text-gray-600 mb-6">
                    Select what feels right for your reflection today
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button 
                    variant="outline" 
                    className="h-24 bg-white hover:bg-blue-50 border-blue-200 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => handleOpenPrompt("fitness")}
                  >
                    <div className="text-center">
                      <HeartHandshake className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <span className="font-semibold text-lg">After Exercise</span>
                      <p className="text-sm text-muted-foreground">Reflect on physical activity</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-24 bg-white hover:bg-green-50 border-green-200 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => handleOpenPrompt("mindfulness")}
                  >
                    <div className="text-center">
                      <HeartHandshake className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <span className="font-semibold text-lg">Quiet Moments</span>
                      <p className="text-sm text-muted-foreground">Peaceful reflection time</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-24 bg-white hover:bg-purple-50 border-purple-200 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => handleOpenPrompt("social")}
                  >
                    <div className="text-center">
                      <HeartHandshake className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <span className="font-semibold text-lg">With Others</span>
                      <p className="text-sm text-muted-foreground">Social connections</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-24 bg-white hover:bg-amber-50 border-amber-200 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => handleOpenPrompt("general")}
                  >
                    <div className="text-center">
                      <HeartHandshake className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                      <span className="font-semibold text-lg">General Gratitude</span>
                      <p className="text-sm text-muted-foreground">Daily appreciation</p>
                    </div>
                  </Button>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border border-blue-200 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <Brain className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-xl text-blue-800">Why the "WHY" Matters for Your Brain</span>
                  </div>
                  <p className="text-blue-700 text-lg">
                    When you explain <strong>why</strong> you're grateful, you engage deeper neural pathways, 
                    strengthen emotional processing, and create lasting positive mental patterns. This isn't just feel-good practice—it's brain training!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent id="journal-section" value="journal" className="space-y-4">
            <GratitudeJournal />
          </TabsContent>
          
          <TabsContent id="insights-section" value="insights" className="space-y-4">
            <GratitudeDashboard />
          </TabsContent>
        </Tabs>
        
        {/* Enhanced Gratitude Prompt Dialog */}
        <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
          <DialogContent className="max-w-4xl">
            <EnhancedGratitudePrompt 
              promptType={promptType}
              onSave={handleSaveGratitude}
              onClose={() => setIsPromptOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* MAIN Quick Add Dialog - This opens when clicking the big buttons */}
        <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
          <EntryDetailsDialog
            isNewEntry={true}
            onClose={() => setIsQuickAddOpen(false)}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default Gratitude;

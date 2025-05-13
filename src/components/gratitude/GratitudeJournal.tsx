
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Search, Calendar, Star, HeartHandshake, Share2, Trash2, MessageCircle } from "lucide-react";
import { GratitudeEntry } from "./GratitudePrompt";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useGratitude } from "@/hooks/use-gratitude";

export function GratitudeJournal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<GratitudeEntry | null>(null);
  const { entries, deleteEntry, updateEntry } = useGratitude();
  
  // Filter entries based on search and filter
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.gratitudeText.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = !filterType || entry.promptType === filterType;
    
    return matchesSearch && matchesFilter;
  });
  
  const handleShare = (entry: GratitudeEntry) => {
    updateEntry(entry.id, { isShared: !entry.isShared });
    toast.success(entry.isShared ? 
      "Entry is now private" : 
      "Entry shared with your trusted contacts");
  };
  
  const getPromptTypeLabel = (type: string) => {
    switch (type) {
      case "fitness": return "Fitness";
      case "mindfulness": return "Mindfulness";
      case "social": return "Social";
      default: return "General";
    }
  };
  
  const getMoodEmoji = (score: number) => {
    switch (score) {
      case 1: return "😔";
      case 2: return "😐";
      case 3: return "🙂";
      case 4: return "😊";
      case 5: return "😄";
      default: return "🙂";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your gratitude entries..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={!filterType ? "default" : "outline"}
            size="sm" 
            onClick={() => setFilterType(null)}
          >
            All
          </Button>
          <Button 
            variant={filterType === "fitness" ? "default" : "outline"}
            size="sm" 
            onClick={() => setFilterType("fitness")}
          >
            Fitness
          </Button>
          <Button 
            variant={filterType === "mindfulness" ? "default" : "outline"}
            size="sm" 
            onClick={() => setFilterType("mindfulness")}
          >
            Mindfulness
          </Button>
          <Button 
            variant={filterType === "social" ? "default" : "outline"}
            size="sm" 
            onClick={() => setFilterType("social")}
          >
            Social
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map(entry => (
            <Card key={entry.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <HeartHandshake className="h-5 w-5 text-primary" />
                    <Badge variant="outline">{getPromptTypeLabel(entry.promptType)}</Badge>
                    {entry.activity && (
                      <Badge variant="secondary">{entry.activity}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span title={`Mood: ${entry.moodScore}/5`} className="text-xl">
                      {getMoodEmoji(entry.moodScore)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base">{entry.gratitudeText}</p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-primary/5">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        View details
                      </Button>
                    </DialogTrigger>
                    {selectedEntry && (
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Gratitude Reflection</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Date</h4>
                            <p className="text-muted-foreground">
                              {format(new Date(selectedEntry.date), "MMMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">Activity Type</h4>
                            <p className="text-muted-foreground">{getPromptTypeLabel(selectedEntry.promptType)}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">What I'm grateful for</h4>
                            <p>{selectedEntry.gratitudeText}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">How it made me feel</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{getMoodEmoji(selectedEntry.moodScore)}</span>
                              <span>Mood score: {selectedEntry.moodScore}/5</span>
                            </div>
                          </div>
                          {selectedEntry.tags.length > 0 && (
                            <div>
                              <h4 className="font-medium">Themes</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedEntry.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="bg-primary/5">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            variant="ghost"
                            onClick={() => handleShare(selectedEntry)}
                          >
                            <Share2 className={`h-4 w-4 mr-1 ${selectedEntry.isShared ? "text-primary" : ""}`} />
                            {selectedEntry.isShared ? "Make Private" : "Share"}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              deleteEntry(selectedEntry.id);
                              setSelectedEntry(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={entry.isShared ? "text-primary" : "text-muted-foreground"}
                    onClick={() => handleShare(entry)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    {entry.isShared ? "Shared" : "Private"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HeartHandshake className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No gratitude entries found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery || filterType 
                  ? "Try adjusting your search or filters" 
                  : "Start recording moments of gratitude to see them here"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

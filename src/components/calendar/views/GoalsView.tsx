
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target } from "lucide-react";
import { ListView } from "../goals/ListView";
import { sampleGoals, sampleActions } from "../data/sampleGoalsData";

export function GoalsView() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("list");

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted/20 py-2 px-4 border-b flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <Target className="mr-1 h-4 w-4" />
          Goals & Actions
        </h3>
        
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "kanban" | "list")}>
            <TabsList className="h-8">
              <TabsTrigger value="list" className="text-xs px-2 py-1 h-6">List View</TabsTrigger>
              <TabsTrigger value="kanban" className="text-xs px-2 py-1 h-6">Kanban View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <ScrollArea className="h-[500px]">
        <div className="p-4">
          {viewMode === "list" ? (
            <ListView 
              goals={sampleGoals} 
              actions={sampleActions}
            />
          ) : (
            <div className="text-center text-muted-foreground p-4">
              Kanban view will be implemented soon
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

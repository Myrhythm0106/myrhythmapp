
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight, Check, Target, Calendar, ListCheck, Flag, Plus, Link, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventForm } from "@/components/calendar/EventForm";

// Types
interface Goal {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly" | "long-term";
  description?: string;
  progress: number; // 0-100
  dueDate?: string;
  createdAt: string;
  linkedActions: string[]; // Array of action IDs
}

interface Action {
  id: string;
  title: string;
  type: "appointment" | "meeting" | "task" | "reminder";
  date: string;
  startTime: string;
  endTime?: string;
  status: "completed" | "pending" | "in-progress" | "canceled";
  goalId?: string;
}

// Sample data
const sampleGoals: Goal[] = [
  {
    id: "g1",
    title: "Improve memory skills",
    type: "weekly",
    description: "Practice memory exercises regularly to improve recall",
    progress: 60,
    dueDate: "2023-06-15",
    createdAt: "2023-05-01",
    linkedActions: ["a1", "a3", "a5"]
  },
  {
    id: "g2",
    title: "Maintain regular therapy sessions",
    type: "monthly",
    description: "Attend all scheduled therapy sessions",
    progress: 75,
    dueDate: "2023-07-01",
    createdAt: "2023-05-05",
    linkedActions: ["a2", "a4"]
  },
  {
    id: "g3",
    title: "Reduce anxiety levels",
    type: "long-term",
    description: "Use mindfulness techniques to manage stress and anxiety",
    progress: 40,
    createdAt: "2023-04-15",
    linkedActions: ["a6"]
  }
];

const sampleActions: Action[] = [
  {
    id: "a1",
    title: "Memory card game exercise",
    type: "task",
    date: "2023-05-20",
    startTime: "10:00 AM",
    status: "completed",
    goalId: "g1"
  },
  {
    id: "a2",
    title: "Cognitive therapy session",
    type: "appointment",
    date: "2023-05-22",
    startTime: "2:30 PM",
    endTime: "3:30 PM",
    status: "pending",
    goalId: "g2"
  },
  {
    id: "a3",
    title: "Brain training app exercises",
    type: "task",
    date: "2023-05-25",
    startTime: "6:00 PM",
    status: "pending",
    goalId: "g1"
  },
  {
    id: "a4",
    title: "Group therapy session",
    type: "meeting",
    date: "2023-05-27",
    startTime: "11:15 AM",
    endTime: "12:30 PM",
    status: "in-progress",
    goalId: "g2"
  },
  {
    id: "a5",
    title: "Review memory flashcards",
    type: "reminder",
    date: "2023-05-28",
    startTime: "09:00 AM",
    status: "pending",
    goalId: "g1"
  },
  {
    id: "a6",
    title: "Mindfulness meditation",
    type: "task",
    date: "2023-05-26",
    startTime: "07:30 AM",
    status: "completed",
    goalId: "g3"
  },
  {
    id: "a7",
    title: "Doctor appointment",
    type: "appointment",
    date: "2023-05-29",
    startTime: "3:00 PM",
    endTime: "4:00 PM",
    status: "pending"
  }
];

export function GoalsView() {
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"kanban" | "list">("list");

  const toggleGoalExpanded = (goalId: string) => {
    setExpandedGoals(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }));
  };

  const getGoalTypeIcon = (type: Goal["type"]) => {
    switch(type) {
      case "daily":
        return <Flag className="h-4 w-4 mr-1" />;
      case "weekly":
        return <Flag className="h-4 w-4 mr-1" />;
      case "monthly":
        return <Target className="h-4 w-4 mr-1" />;
      case "long-term":
        return <ListCheck className="h-4 w-4 mr-1" />;
      default:
        return <Target className="h-4 w-4 mr-1" />;
    }
  };

  const getStatusBadge = (status: Action["status"]) => {
    switch(status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>;
      case "canceled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Canceled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getGoalActions = (goalId: string) => {
    return sampleActions.filter(action => action.goalId === goalId);
  };

  const getActionsWithoutGoals = () => {
    return sampleActions.filter(action => !action.goalId);
  };

  const renderListView = () => (
    <div className="space-y-4">
      {/* Goals with their linked actions */}
      {sampleGoals.map(goal => (
        <Card key={goal.id} className="border-l-4 border-l-primary">
          <CardContent className="p-0">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30"
              onClick={() => toggleGoalExpanded(goal.id)}
            >
              <div className="flex items-center space-x-2">
                {expandedGoals[goal.id] ? 
                  <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                }
                <div className="flex items-center">
                  {getGoalTypeIcon(goal.type)}
                  <span className="font-medium">{goal.title}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-sm text-muted-foreground flex items-center">
                  <CalendarClock className="h-3.5 w-3.5 mr-1" />
                  {goal.dueDate || "No due date"}
                </div>
                
                <div className="w-24">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        goal.progress >= 70 ? "bg-green-500" : 
                        goal.progress >= 40 ? "bg-amber-500" : 
                        "bg-red-500"
                      )} 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {expandedGoals[goal.id] && (
              <div className="px-4 pb-4 pt-0">
                {goal.description && (
                  <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                )}
                
                <div className="border rounded-md overflow-hidden mb-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Action</TableHead>
                        <TableHead>Date/Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getGoalActions(goal.id).map(action => (
                        <TableRow key={action.id}>
                          <TableCell className="font-medium">{action.title}</TableCell>
                          <TableCell>{action.date} {action.startTime}</TableCell>
                          <TableCell>{getStatusBadge(action.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full" size="sm">
                                <Plus className="mr-1 h-3.5 w-3.5" />
                                Add action for this goal
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Action for Goal: {goal.title}</DialogTitle>
                              </DialogHeader>
                              <EventForm goalId={goal.id} />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {/* Unlinked Actions */}
      <Card className="border-l-4 border-l-gray-300">
        <CardContent className="p-0">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30"
            onClick={() => toggleGoalExpanded('unlinked')}
          >
            <div className="flex items-center space-x-2">
              {expandedGoals['unlinked'] ? 
                <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              }
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="font-medium">Actions Without Goals</span>
              </div>
            </div>
          </div>
          
          {expandedGoals['unlinked'] && (
            <div className="px-4 pb-4 pt-0">
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Action</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getActionsWithoutGoals().map(action => (
                      <TableRow key={action.id}>
                        <TableCell className="font-medium">{action.title}</TableCell>
                        <TableCell>{action.date} {action.startTime}</TableCell>
                        <TableCell>{getStatusBadge(action.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Link to Goal</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            {/* Add a goal form component here */}
            <div className="p-4">
              <p className="text-muted-foreground">Goal form would go here.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted/20 py-2 px-4 border-b flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <Target className="mr-1 h-4 w-4" />
          Goals & Actions
        </h3>
        
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "kanban" | "list")}>
          <TabsList className="h-8">
            <TabsTrigger value="list" className="text-xs px-2 py-1 h-6">List View</TabsTrigger>
            <TabsTrigger value="kanban" className="text-xs px-2 py-1 h-6">Kanban View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="h-[500px]">
        <div className="p-4">
          {viewMode === "list" ? renderListView() : (
            <div className="text-center text-muted-foreground p-4">
              Kanban view will be implemented soon
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}


import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Info, Plus, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  type: "appointment" | "medication" | "task" | "exercise";
  notes?: string;
  completed?: boolean;
}

export function UpcomingToday() {
  const navigate = useNavigate();
  const { actions, completeAction, loading } = useDailyActions();
  
  // Get today's actions
  const today = React.useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayActions = actions.filter(action => action.date === today);
  
  const handleViewDetails = (action: any) => {
    navigate(`/calendar?actionId=${action.id}`);
    toast.info(`Opening details for ${action.title}`);
  };
  
  const markActionCompleted = async (id: string) => {
    try {
      await completeAction(id);
      toast.success("🎯 Action completed!", {
        description: "Great job following through on your plan! This builds cognitive strength.",
        duration: 4000
      });
    } catch (error) {
      toast.error("Failed to update action");
    }
  };

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case "health": return "bg-green-100 text-green-800";
      case "work": return "bg-blue-100 text-blue-800";
      case "personal": return "bg-purple-100 text-purple-800";
      case "family": return "bg-rose-100 text-rose-800";
      case "rest": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  if (loading) {
    return (
      <Card className="border-l-4 border-l-brain-purple-400 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-5 w-5 text-brain-purple-500 animate-pulse" />
            Loading Your Empowering Actions...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-brain-purple-400 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="h-5 w-5 text-brain-purple-500" />
          Your Empowering Actions Today
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {todayActions.length > 0 
            ? `${todayActions.filter(a => a.status === 'completed').length} of ${todayActions.length} actions completed - building cognitive strength!`
            : "Ready to create some brain-empowering actions?"
          }
        </p>
      </CardHeader>
      
      <CardContent className="pt-1">
        {todayActions.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground">No actions scheduled for today</p>
            <p className="text-xs text-muted-foreground">Create your first empowering action to start building cognitive strength!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {todayActions.map(action => (
              <li 
                key={action.id}
                className={`p-3 border rounded-md ${action.status === 'completed' ? 'bg-muted/30 border-dashed' : 'bg-white'} hover:bg-muted/10 transition-colors cursor-pointer`}
                onClick={() => handleViewDetails(action)}
              >
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={action.status === 'completed'} 
                    onChange={(e) => {
                      e.stopPropagation();
                      if (action.status !== 'completed') {
                        markActionCompleted(action.id);
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-brain-purple-600 focus:ring-brain-purple-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className={`flex-1 ${action.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium">{action.title}</span>
                      {action.start_time && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(`2000-01-01T${action.start_time}`), 'h:mm a')}</span>
                        </div>
                      )}
                    </div>
                    
                    {action.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </div>
                    )}
                  </div>
                  
                  <Badge className={`text-xs ${getActionTypeColor(action.action_type)}`} variant="outline">
                    {action.action_type}
                  </Badge>
                  
                  {action.difficulty_level && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: action.difficulty_level }, (_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-clarity-teal-500 rounded-full"></div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={() => navigate("/calendar")}
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Empowering Action
        </Button>
      </CardFooter>
    </Card>
  );
}


import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Target, Plus, CheckCircle, Clock, Calendar } from "lucide-react";

const Goals = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");

  const goals = [
    {
      id: 1,
      title: "Complete Daily Brain Training",
      description: "Finish at least one brain game every day for cognitive improvement",
      progress: 85,
      target: 30,
      current: 25,
      unit: "days",
      deadline: "2024-02-15",
      status: "active",
      category: "cognitive"
    },
    {
      id: 2,
      title: "Maintain Medication Schedule",
      description: "Take all medications on time as prescribed",
      progress: 95,
      target: 100,
      current: 95,
      unit: "% compliance",
      deadline: "2024-01-31",
      status: "active",
      category: "health"
    },
    {
      id: 3,
      title: "Return to Work Part-Time",
      description: "Gradually return to work starting with 20 hours per week",
      progress: 40,
      target: 20,
      current: 8,
      unit: "hours/week",
      deadline: "2024-03-01",
      status: "active",
      category: "career"
    },
    {
      id: 4,
      title: "Build Energy Stamina",
      description: "Increase daily energy levels through better sleep and routine",
      progress: 100,
      target: 8,
      current: 8,
      unit: "hours sleep",
      deadline: "2024-01-20",
      status: "completed",
      category: "wellness"
    }
  ];

  const handleCreateGoal = () => {
    if (newGoalTitle.trim()) {
      console.log("Creating goal:", { title: newGoalTitle, description: newGoalDescription });
      setNewGoalTitle("");
      setNewGoalDescription("");
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cognitive': return 'bg-purple-100 text-purple-800';
      case 'health': return 'bg-red-100 text-red-800';
      case 'career': return 'bg-blue-100 text-blue-800';
      case 'wellness': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Goals & Milestones
        </h1>
        <p className="text-lg text-muted-foreground">
          Set and track meaningful goals for your recovery journey
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
            <div className="text-sm text-muted-foreground">Active Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(activeGoals.reduce((acc, goal) => acc + goal.progress, 0) / activeGoals.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </div>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Create New Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Goal title..."
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
            />
            <Textarea
              placeholder="Describe your goal and why it's important to you..."
              value={newGoalDescription}
              onChange={(e) => setNewGoalDescription(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateGoal}>Create Goal</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Active Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div className="flex space-x-1">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{goal.current} / {goal.target} {goal.unit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-muted-foreground mt-1">
                        {goal.progress}% complete
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Target: {goal.deadline}
                      </span>
                      <Button size="sm">Update Progress</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Completed Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedGoals.map((goal) => (
                <Card key={goal.id} className="opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        {goal.title}
                      </CardTitle>
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-green-600 font-medium">
                      ✅ Completed on {goal.deadline}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;

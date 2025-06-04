
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, ArrowDown, CheckCircle2, Lightbulb, BookOpen, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GoalCreationWizard } from "./GoalCreationWizard";

export function GoalDefinitionGuide() {
  const [showWizard, setShowWizard] = useState(false);

  const goalExamples = [
    {
      category: "Independence",
      icon: <Target className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
      goals: [
        "Walk to the mailbox by myself",
        "Make my own breakfast",
        "Use public transportation"
      ]
    },
    {
      category: "Cognitive",
      icon: <BookOpen className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-50 border-purple-200",
      goals: [
        "Read a complete book",
        "Remember daily routines",
        "Learn a new skill"
      ]
    },
    {
      category: "Emotional",
      icon: <Heart className="h-5 w-5 text-pink-500" />,
      color: "bg-pink-50 border-pink-200",
      goals: [
        "Build confidence in social situations",
        "Manage anxiety better",
        "Express feelings clearly"
      ]
    }
  ];

  const actionBreakdownSteps = [
    {
      step: "1. Choose Your Goal",
      description: "Pick something meaningful that moves you toward independence",
      example: "Goal: Walk to the mailbox by myself"
    },
    {
      step: "2. Break Into Smaller Parts",
      description: "Divide your goal into 3-5 manageable steps",
      example: "• Walk to front door • Walk to driveway • Walk to mailbox"
    },
    {
      step: "3. Create Daily Actions",
      description: "Turn each part into specific daily actions you can complete",
      example: "Today: Stand up and walk 5 steps to the front door"
    },
    {
      step: "4. Track & Celebrate",
      description: "Mark completed actions and celebrate your progress",
      example: "✓ Completed! You're building momentum!"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Understanding Goals & Actions
          </CardTitle>
          <p className="text-muted-foreground">
            Goals are your dreams broken down into achievable steps. Actions are the daily steps that get you there.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="examples" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="examples">Goal Examples</TabsTrigger>
              <TabsTrigger value="breakdown">How to Break Down</TabsTrigger>
              <TabsTrigger value="tracking">Tracking Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="examples" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {goalExamples.map((category) => (
                  <Card key={category.category} className={`${category.color} border`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {category.icon}
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.goals.map((goal, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="breakdown" className="space-y-4">
              <div className="space-y-4">
                {actionBreakdownSteps.map((step, index) => (
                  <Card key={index} className="border-l-4 border-l-orange-400">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-orange-100 text-orange-800 mt-1">
                          {step.step}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{step.description}</p>
                          <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                            {step.example}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tracking" className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Your Progress Matters
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-green-700">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Every small action completed is progress
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Track daily actions on your calendar
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Celebrate completions - they build momentum
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Adjust goals as you learn and grow
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="pt-4 border-t mt-6">
            <Dialog open={showWizard} onOpenChange={setShowWizard}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Start Creating Your First Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Goal Creation Wizard</DialogTitle>
                </DialogHeader>
                <GoalCreationWizard onComplete={() => setShowWizard(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

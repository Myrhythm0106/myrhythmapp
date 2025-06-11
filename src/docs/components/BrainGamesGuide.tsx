
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Award } from "lucide-react";

export function BrainGamesGuide() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-medium text-foreground">Brain Games & Cognitive Training</h3>
        <Badge variant="secondary">Cognitive Rehabilitation</Badge>
      </div>
      
      <p className="text-foreground">
        Our brain games are specifically designed to support cognitive rehabilitation and recovery. 
        Each game targets different cognitive domains essential for daily functioning and independence.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Memory & Focus Games
            </CardTitle>
          </CardHeader>
          <CardContent className="text-purple-700 space-y-2">
            <div>
              <p className="font-medium">Memory Match:</p>
              <p className="text-sm">Improve working memory and visual recognition</p>
            </div>
            <div>
              <p className="font-medium">Sequence Challenge:</p>
              <p className="text-sm">Enhance pattern recognition and sequential processing</p>
            </div>
            <div>
              <p className="font-medium">Focus Training:</p>
              <p className="text-sm">Develop sustained attention and concentration</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Adaptive Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-700 space-y-2">
            <div>
              <p className="font-medium">Three Levels:</p>
              <ul className="text-sm space-y-1">
                <li>• <strong>Low:</strong> Gentle introduction, builds confidence</li>
                <li>• <strong>Medium:</strong> Moderate challenge, skill building</li>
                <li>• <strong>High:</strong> Advanced training, peak performance</li>
              </ul>
            </div>
            <div className="text-xs bg-green-100 p-2 rounded border-green-300 border mt-2">
              Games automatically adjust based on your performance and progress
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-foreground">Getting Started with Brain Games</h4>
        
        <div className="space-y-4">
          <div className="flex gap-4 p-4 border rounded-lg bg-muted/30">
            <Badge variant="outline" className="mt-1 shrink-0">1</Badge>
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Start with Assessment</h5>
              <p className="text-sm text-muted-foreground">
                Begin with a quick cognitive assessment to determine your baseline and recommended starting difficulty. 
                This helps us personalize your training program.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 border rounded-lg bg-muted/30">
            <Badge variant="outline" className="mt-1 shrink-0">2</Badge>
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Choose Your Games</h5>
              <p className="text-sm text-muted-foreground">
                Select games that target your specific cognitive goals. For memory issues, start with Memory Match. 
                For attention problems, try Focus Training first.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 border rounded-lg bg-muted/30">
            <Badge variant="outline" className="mt-1 shrink-0">3</Badge>
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Set a Routine</h5>
              <p className="text-sm text-muted-foreground">
                Consistency is key for cognitive improvement. Aim for 10-15 minutes daily rather than longer, 
                infrequent sessions. Set up calendar reminders for your brain training time.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 border rounded-lg bg-muted/30">
            <Badge variant="outline" className="mt-1 shrink-0">4</Badge>
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Track Progress</h5>
              <p className="text-sm text-muted-foreground">
                Review your performance trends, celebrate improvements, and share progress with your healthcare team. 
                The games provide detailed analytics and insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Understanding Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div>
              <p className="font-medium">What to Track:</p>
              <ul className="space-y-1">
                <li>• Reaction time improvements</li>
                <li>• Accuracy percentage increases</li>
                <li>• Consecutive play streaks</li>
                <li>• Difficulty level progression</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Realistic Expectations:</p>
              <ul className="space-y-1">
                <li>• Small improvements add up over time</li>
                <li>• Some days will be better than others</li>
                <li>• Progress isn't always linear</li>
                <li>• Celebrate every small victory</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-700 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div>
              <p className="font-medium">Best Practices:</p>
              <ul className="space-y-1">
                <li>• Play when you're alert and focused</li>
                <li>• Take breaks if you feel frustrated</li>
                <li>• Ensure good lighting and comfort</li>
                <li>• Stay hydrated during sessions</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Avoid Common Mistakes:</p>
              <ul className="space-y-1">
                <li>• Don't rush through exercises</li>
                <li>• Avoid playing when very tired</li>
                <li>• Don't compare yourself to others</li>
                <li>• Don't skip days without good reason</li>
              </ul>
            </div>
          </div>
          <div className="text-xs bg-amber-100 p-2 rounded border-amber-300 border mt-3">
            <strong>Remember:</strong> Cognitive recovery is a marathon, not a sprint. Consistent, gentle practice yields the best results.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

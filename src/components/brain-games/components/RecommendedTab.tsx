
import React from "react";
import { Brain, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export function RecommendedTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Complete a brief assessment for custom game recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-muted-foreground mb-4">
            Answer a few questions about your goals, preferences, and challenges
            to receive tailored game suggestions that support your rehabilitation journey.
          </p>
          <div className="rounded-md bg-muted/30 p-4 text-sm">
            <p className="font-medium mb-1">Benefits of Personalization:</p>
            <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
              <li>Games matched to your cognitive profile</li>
              <li>Targeted practice for your specific needs</li>
              <li>Appropriate challenge levels based on abilities</li>
              <li>Track progress on relevant cognitive domains</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="default" className="w-full">Start Assessment</Button>
        </CardFooter>
      </Card>
      
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Weekly Practice Plan
          </CardTitle>
          <CardDescription>
            Structured cognitive training schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-muted-foreground mb-4">
            Get a balanced week of cognitive exercises designed by rehabilitation specialists
            to provide comprehensive brain training across different domains.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-muted/20 rounded p-3">
              <p className="font-medium text-sm mb-1">Monday & Thursday</p>
              <p className="text-xs text-muted-foreground">Memory Focus</p>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-medium text-sm mb-1">Tuesday & Friday</p>
              <p className="text-xs text-muted-foreground">Attention Focus</p>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-medium text-sm mb-1">Wednesday</p>
              <p className="text-xs text-muted-foreground">Processing Speed</p>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-medium text-sm mb-1">Weekend</p>
              <p className="text-xs text-muted-foreground">Flexible Choice</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">View Details</Button>
          <Button variant="default" className="flex items-center gap-1">
            Activate Plan
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

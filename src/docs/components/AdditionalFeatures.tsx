
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, Clock, Heart, FileText } from "lucide-react";

export function AdditionalFeatures() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Additional Features</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            <CardTitle className="text-foreground">Global Search</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Quickly find anything in the app using the search function. Access it by clicking the search icon or pressing Ctrl+K (Cmd+K on Mac).</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <CardTitle className="text-foreground">Pomodoro Timer</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Enhance productivity with the built-in Pomodoro technique timer. Set focused work sessions and breaks to maintain concentration.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <CardTitle className="text-foreground">Gratitude Journal</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Record daily moments of gratitude to improve mental wellbeing and build a positive mindset over time.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle className="text-foreground">Resources</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Access helpful guides, FAQs, tutorials, and official documents to get the most out of the application.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

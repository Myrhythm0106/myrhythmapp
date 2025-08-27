
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function CommunityGuide() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium text-foreground">Community Features</h3>
      <p className="text-foreground">
        Connect with others, share experiences, and build a support network.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Message Board</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Share thoughts, questions, and insights with your community in a safe, supportive environment.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Coach & Community Q&A (Non-medical)</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Peer and coach guidance (non-medical) to support your journey.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Community Groups</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Join specialized groups based on shared experiences, conditions, or interests.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Personal Community</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Connect with your personal support network including family, friends, and caregivers.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

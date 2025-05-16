
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function BrainRecoveryGuide() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium text-foreground">Brain Recovery Features</h3>
      <p className="text-foreground">
        Tools and activities designed to support cognitive health and recovery.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Brain Games</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Engage with cognitive exercises designed to strengthen various aspects of brain function.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Memory Match</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>A classic memory game to improve recall and concentration with adjustable difficulty levels.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Daily Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Personalized cognitive activities suggested based on your recovery progress and needs.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Monitor improvements in cognitive performance over time with detailed metrics.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

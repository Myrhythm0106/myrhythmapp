
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube } from "lucide-react";

export const TutorialVideos = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutorial Videos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Getting Started with MyRhythm", 
            "How to Track Symptoms Effectively",
            "Managing Your Calendar",
            "Using the Community Features",
            "Setting Up Your Support Circle",
            "Privacy and Security Features"
          ].map((title, index) => (
            <Card key={index} className="flex items-center p-4">
              <div className="bg-muted rounded-md p-6 mr-4">
                <Youtube className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">3:24</p>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

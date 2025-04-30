
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import { Link } from "react-router-dom";

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
}

export function ResourcesCard() {
  // Sample resources - in a real app, these would come from an API or database
  const resources: Resource[] = [
    {
      id: "1",
      title: "Understanding TBI Recovery",
      category: "Education",
      description: "Learn about the stages of recovery after a traumatic brain injury.",
    },
    {
      id: "2",
      title: "Cognitive Rehabilitation Exercises",
      category: "Self-Help",
      description: "Daily exercises to help improve memory and cognitive function.",
    },
    {
      id: "3",
      title: "Dallas Support Groups Directory",
      category: "Community",
      description: "Find local support groups specific to your needs in Dallas.",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Featured Resources</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/resources">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div key={resource.id} className="flex items-start gap-4">
              <div className="rounded-md bg-muted p-2">
                <Book className="h-5 w-5 text-beacon-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium leading-none">{resource.title}</h4>
                <p className="text-xs text-muted-foreground">{resource.category}</p>
                <p className="text-sm">{resource.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Phone } from "lucide-react";

interface EmergencyResource {
  id: string;
  name: string;
  phone: string;
  description: string;
}

export function EmergencyResourcesCard() {
  // Sample emergency resources - in a real app, these might be pulled from a database
  const resources: EmergencyResource[] = [
    {
      id: "1",
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7, free and confidential support for people in distress",
    },
    {
      id: "2",
      name: "Dallas Crisis Support",
      phone: "214-828-1000",
      description: "Local mental health crisis services",
    },
    {
      id: "3",
      name: "Emergency Services",
      phone: "911",
      description: "For immediate life-threatening emergencies",
    },
  ];

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-xl font-semibold">Emergency Resources</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.map((resource) => (
            <div key={resource.id} className="rounded-lg border border-muted bg-card p-3">
              <div className="mb-1 font-medium">{resource.name}</div>
              <p className="text-sm text-muted-foreground">{resource.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full" 
                onClick={() => window.open(`tel:${resource.phone.replace(/-/g, "")}`)}
              >
                <Phone className="mr-1 h-4 w-4" />
                {resource.phone}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

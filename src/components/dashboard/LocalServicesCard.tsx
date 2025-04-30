
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface LocalService {
  id: string;
  name: string;
  type: string;
  address: string;
  distance: string;
}

export function LocalServicesCard() {
  // Sample services - in a real app, these would come from an API or database
  const services: LocalService[] = [
    {
      id: "1",
      name: "Dallas Brain Injury Support Group",
      type: "Support Group",
      address: "2800 Live Oak St, Dallas, TX 75204",
      distance: "1.2 miles",
    },
    {
      id: "2",
      name: "Texas NeuroRehab Center",
      type: "Rehabilitation",
      address: "6301 Gaston Ave, Dallas, TX 75214",
      distance: "3.5 miles",
    },
    {
      id: "3",
      name: "Mental Health Dallas",
      type: "Mental Health",
      address: "4300 MacArthur Ave, Dallas, TX 75209",
      distance: "5.1 miles",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Local Services</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/local-services">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-start gap-4">
              <div className="rounded-md bg-muted p-2">
                <MapPin className="h-5 w-5 text-beacon-600" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium leading-none">{service.name}</h4>
                  <span className="text-xs text-muted-foreground">{service.distance}</span>
                </div>
                <p className="text-xs text-muted-foreground">{service.type}</p>
                <p className="text-sm">{service.address}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

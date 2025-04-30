
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface CommunityGroupProps {
  name: string;
  description: string;
  memberCount: number;
  image: string;
}

export function CommunityGroup({ name, description, memberCount, image }: CommunityGroupProps) {
  const [joined, setJoined] = React.useState(false);
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-32 bg-cover bg-center" 
        style={{ backgroundImage: `url(${image})` }}
      />
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{memberCount} members</span>
          </div>
          <Button 
            variant={joined ? "outline" : "default"}
            size="sm"
            onClick={() => setJoined(!joined)}
          >
            {joined ? "Leave Group" : "Join Group"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

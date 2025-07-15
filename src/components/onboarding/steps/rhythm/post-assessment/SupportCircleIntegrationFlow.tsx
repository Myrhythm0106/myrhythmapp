
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";
import { UserType } from "@/types/user";

interface SupportCircleIntegrationFlowProps {
  userType: UserType;
  assessmentResult: any;
  onComplete: () => void;
}

export function SupportCircleIntegrationFlow({ userType, assessmentResult, onComplete }: SupportCircleIntegrationFlowProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Support Circle Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Connect with your support network to enhance your journey.
        </p>
        
        <div className="space-y-3">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Family & Friends</h4>
            <p className="text-sm text-muted-foreground">
              Share your progress and get encouragement from loved ones.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Healthcare Team</h4>
            <p className="text-sm text-muted-foreground">
              Keep your medical professionals informed of your progress.
            </p>
          </div>
        </div>
        
        <Button onClick={onComplete} className="w-full">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

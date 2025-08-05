import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Crown } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

export function DemoModeToggle() {
  const { demoMode, setDemoMode, tier } = useSubscription();

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {demoMode ? (
                <Crown className="h-5 w-5 text-amber-500" />
              ) : (
                <Zap className="h-5 w-5 text-gray-500" />
              )}
              <Label htmlFor="demo-mode" className="font-medium">
                {demoMode ? "Premium Demo Active" : "Free Tier Active"}
              </Label>
            </div>
            <Switch
              id="demo-mode"
              checked={demoMode}
              onCheckedChange={setDemoMode}
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {demoMode 
            ? "Full access to all MyRhythm features for demonstration" 
            : `Current tier: ${tier} - Limited features available`
          }
        </p>
      </CardContent>
    </Card>
  );
}
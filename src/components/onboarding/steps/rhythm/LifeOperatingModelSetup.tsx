import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Clock, Target } from "lucide-react";
import { UserType } from "@/types/user";

interface LifeOperatingModelSetupProps {
  onComplete: (data: any) => void;
  assessmentResult: any;
}

export function LifeOperatingModelSetup({ onComplete, assessmentResult }: LifeOperatingModelSetupProps) {
  const [operatingModel, setOperatingModel] = useState({
    focusHours: 4,
    breakFrequency: 60,
    idealWorkEnvironment: "quiet",
    energyTrackingEnabled: true,
    goalSettingFrequency: "weekly"
  });

  const handleContinue = () => {
    onComplete(operatingModel);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Life Operating Model
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Focus Hours */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="focus-hours" className="text-base font-medium">
              Ideal Focus Hours
            </label>
            <Badge variant="secondary">{operatingModel.focusHours} hours</Badge>
          </div>
          <input
            type="range"
            id="focus-hours"
            min="1"
            max="8"
            value={operatingModel.focusHours}
            onChange={(e) => setOperatingModel({ ...operatingModel, focusHours: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Break Frequency */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="break-frequency" className="text-base font-medium">
              Ideal Break Frequency
            </label>
            <Badge variant="secondary">{operatingModel.breakFrequency} minutes</Badge>
          </div>
          <input
            type="range"
            id="break-frequency"
            min="15"
            max="90"
            step="15"
            value={operatingModel.breakFrequency}
            onChange={(e) => setOperatingModel({ ...operatingModel, breakFrequency: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Ideal Work Environment */}
        <div className="space-y-2">
          <label htmlFor="work-environment" className="text-base font-medium">
            Ideal Work Environment
          </label>
          <select
            id="work-environment"
            value={operatingModel.idealWorkEnvironment}
            onChange={(e) => setOperatingModel({ ...operatingModel, idealWorkEnvironment: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="quiet">Quiet & Isolated</option>
            <option value="collaborative">Collaborative & Social</option>
            <option value="flexible">Flexible & Dynamic</option>
          </select>
        </div>

        {/* Goal Setting Frequency */}
        <div className="space-y-2">
          <label htmlFor="goal-frequency" className="text-base font-medium">
            Goal Setting Frequency
          </label>
          <select
            id="goal-frequency"
            value={operatingModel.goalSettingFrequency}
            onChange={(e) => setOperatingModel({ ...operatingModel, goalSettingFrequency: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleContinue} className="w-full">
            Continue to Support Integration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

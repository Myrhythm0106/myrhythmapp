
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, X, Clock } from "lucide-react";
import { useAssessmentManager } from "@/hooks/useAssessmentManager";
import { useNavigate } from "react-router-dom";

interface AssessmentUpgradeReminderProps {
  onClose?: () => void;
}

export function AssessmentUpgradeReminder({ onClose }: AssessmentUpgradeReminderProps) {
  const { reminders, acknowledgeReminder, hasBriefOnly } = useAssessmentManager();
  const navigate = useNavigate();

  const upgradeReminder = reminders.find(r => r.reminderType === 'comprehensive_upgrade');

  if (!upgradeReminder || !hasBriefOnly()) {
    return null;
  }

  const handleUpgrade = () => {
    acknowledgeReminder(upgradeReminder.id);
    navigate('/assessment?type=comprehensive');
  };

  const handleDismiss = () => {
    acknowledgeReminder(upgradeReminder.id);
    onClose?.();
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Unlock Your Full Potential</h3>
              <Badge className="bg-purple-100 text-purple-700">Recommended</Badge>
            </div>
            
            <p className="text-sm text-purple-700">
              You've been using MyRhythm for a week! Ready to get more personalized insights with our comprehensive assessment? 
              It takes just 5 minutes and will unlock more accurate recommendations tailored to your unique needs.
            </p>
            
            <div className="flex items-center gap-2 text-xs text-purple-600">
              <Clock className="h-3 w-3" />
              <span>5-7 minutes • More detailed insights • Better recommendations</span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleUpgrade}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                size="sm"
              >
                Upgrade Assessment
              </Button>
              <Button 
                onClick={handleDismiss}
                variant="ghost" 
                size="sm"
                className="text-purple-600 hover:text-purple-700"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-purple-500 hover:text-purple-700 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

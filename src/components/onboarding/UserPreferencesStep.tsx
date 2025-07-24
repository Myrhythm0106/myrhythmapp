import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock, Globe } from "lucide-react";

interface UserPreferencesStepProps {
  onNext: (preferences: UserPreferences) => void;
  onBack: () => void;
}

export interface UserPreferences {
  dateFormat: "dd/mm/yyyy" | "mm/dd/yyyy";
  timeFormat: "12h" | "24h";
  timezone: string;
}

export function UserPreferencesStep({ onNext, onBack }: UserPreferencesStepProps) {
  const [dateFormat, setDateFormat] = React.useState<"dd/mm/yyyy" | "mm/dd/yyyy">("dd/mm/yyyy");
  const [timeFormat, setTimeFormat] = React.useState<"12h" | "24h">("12h");
  const [timezone] = React.useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const handleContinue = () => {
    onNext({
      dateFormat,
      timeFormat,
      timezone
    });
  };

  const currentDate = new Date();
  const ddmmPreview = currentDate.toLocaleDateString('en-GB');
  const mmddPreview = currentDate.toLocaleDateString('en-US');
  const time12Preview = currentDate.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
  const time24Preview = currentDate.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-brain-health-400 to-clarity-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Personalize Your Experience</h2>
        <p className="text-muted-foreground">Set your preferred date and time formats for a comfortable experience</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brain-health-500" />
              Date Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={dateFormat} onValueChange={(value) => setDateFormat(value as any)}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="dd/mm/yyyy" id="dd-mm-yyyy" />
                  <Label htmlFor="dd-mm-yyyy" className="flex-1 cursor-pointer">
                    <div className="font-medium">DD/MM/YYYY</div>
                    <div className="text-sm text-muted-foreground">Example: {ddmmPreview}</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="mm/dd/yyyy" id="mm-dd-yyyy" />
                  <Label htmlFor="mm-dd-yyyy" className="flex-1 cursor-pointer">
                    <div className="font-medium">MM/DD/YYYY</div>
                    <div className="text-sm text-muted-foreground">Example: {mmddPreview}</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-clarity-teal-500" />
              Time Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={timeFormat} onValueChange={(value) => setTimeFormat(value as any)}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="12h" id="12h" />
                  <Label htmlFor="12h" className="flex-1 cursor-pointer">
                    <div className="font-medium">12-Hour Format</div>
                    <div className="text-sm text-muted-foreground">Example: {time12Preview}</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h" className="flex-1 cursor-pointer">
                    <div className="font-medium">24-Hour Format</div>
                    <div className="text-sm text-muted-foreground">Example: {time24Preview}</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5 text-memory-emerald-500" />
            <div>
              <div className="font-medium">Detected Timezone</div>
              <div className="text-sm text-muted-foreground">{timezone}</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Your timezone was automatically detected. This helps us show you the correct times for all your activities.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
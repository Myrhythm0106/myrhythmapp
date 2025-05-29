
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Settings, Check } from "lucide-react";

interface AccessibilityStepProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  highContrast: boolean;
  onHighContrastChange: (enabled: boolean) => void;
  reduceMotion: boolean;
  onReduceMotionChange: (enabled: boolean) => void;
  onComplete: () => void;
}

export function AccessibilityStep({
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastChange,
  reduceMotion,
  onReduceMotionChange,
  onComplete
}: AccessibilityStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Accessibility Settings
        </CardTitle>
        <CardDescription>Make MyRhythm work better for your needs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="font-size" className="flex justify-between">
            <span>Font Size: {fontSize}%</span>
            <span className={fontSize > 100 ? "font-bold" : ""}>
              {fontSize < 85 ? "Smaller" : fontSize > 115 ? "Larger" : "Default"}
            </span>
          </Label>
          <div className="py-2">
            <Slider
              id="font-size"
              min={70}
              max={150}
              step={5}
              value={[fontSize]}
              onValueChange={(values) => onFontSizeChange(values[0])}
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Smaller</span>
              <span>Default</span>
              <span>Larger</span>
            </div>
          </div>
          <div className="mt-2 p-4 border rounded-md bg-muted/20">
            <p style={{ fontSize: `${fontSize}%` }} className="mb-2 font-medium">
              Preview Text
            </p>
            <p style={{ fontSize: `${fontSize}%` }} className="text-muted-foreground">
              This is how your text will appear throughout the app.
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="highContrast">High Contrast Mode</Label>
            <Switch 
              id="highContrast" 
              checked={highContrast}
              onCheckedChange={onHighContrastChange}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Increase contrast between elements for better visibility
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="reduceMotion">Reduce Motion</Label>
            <Switch 
              id="reduceMotion" 
              checked={reduceMotion}
              onCheckedChange={onReduceMotionChange}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Minimize animations and transitions throughout the app
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onComplete} className="ml-auto">
          Complete Setup
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

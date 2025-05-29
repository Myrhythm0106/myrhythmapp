
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Palette, ArrowRight } from "lucide-react";

type ThemeMode = "light" | "dark" | "system";
type LayoutPreference = "standard" | "simplified" | "focused" | "customizable";

interface AppearanceStepProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  layoutPreference: LayoutPreference;
  onLayoutChange: (layout: LayoutPreference) => void;
  enableSwipe: boolean;
  onSwipeChange: (enabled: boolean) => void;
  enableSoundEffects: boolean;
  onSoundEffectsChange: (enabled: boolean) => void;
  onNext: () => void;
}

export function AppearanceStep({
  theme,
  onThemeChange,
  layoutPreference,
  onLayoutChange,
  enableSwipe,
  onSwipeChange,
  enableSoundEffects,
  onSoundEffectsChange,
  onNext
}: AppearanceStepProps) {
  const dashboardLayouts = [
    {
      id: "standard",
      title: "Standard Layout",
      description: "Regular dashboard with all items visible"
    },
    {
      id: "simplified",
      title: "Simplified Layout",
      description: "Fewer items, larger text, more whitespace"
    },
    {
      id: "focused",
      title: "Focus Mode",
      description: "Only show immediate tasks and priorities"
    },
    {
      id: "customizable",
      title: "Customizable Dashboard",
      description: "Drag-and-drop widgets with full customization control"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance Settings
        </CardTitle>
        <CardDescription>Customize how MyRhythm looks and feels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="theme">Theme Mode</Label>
          <RadioGroup 
            id="theme" 
            value={theme} 
            onValueChange={(value) => onThemeChange(value as ThemeMode)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">Use System Settings</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <Label htmlFor="layout-preference">Dashboard Layout</Label>
          <RadioGroup 
            id="layout-preference" 
            value={layoutPreference} 
            onValueChange={(value) => onLayoutChange(value as LayoutPreference)}
            className="flex flex-col space-y-1"
          >
            {dashboardLayouts.map((layout) => (
              <div key={layout.id} className="flex items-center space-x-2">
                <RadioGroupItem value={layout.id} id={layout.id} />
                <div>
                  <Label htmlFor={layout.id}>{layout.title}</Label>
                  <p className="text-sm text-muted-foreground">{layout.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableSwipe">Enable Swipe Gestures</Label>
            <Switch 
              id="enableSwipe" 
              checked={enableSwipe} 
              onCheckedChange={onSwipeChange}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Allow swiping between dashboard sections on mobile devices
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableSounds">Sound Effects</Label>
            <Switch 
              id="enableSounds" 
              checked={enableSoundEffects}
              onCheckedChange={onSoundEffectsChange}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Play subtle sound effects for notifications and interactions
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} className="ml-auto">
          Next: Accessibility
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

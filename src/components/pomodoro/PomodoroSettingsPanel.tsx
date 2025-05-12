
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PomodoroSettings } from "./types";

interface PomodoroSettingsPanelProps {
  settings: PomodoroSettings;
  setSettings: React.Dispatch<React.SetStateAction<PomodoroSettings>>;
}

export function PomodoroSettingsPanel({ settings, setSettings }: PomodoroSettingsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm">Work Duration: {settings.workMinutes} minutes</Label>
        <Slider
          defaultValue={[settings.workMinutes]}
          min={5}
          max={60}
          step={5}
          onValueChange={(value) => 
            setSettings(prev => ({ ...prev, workMinutes: value[0] }))
          }
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm">Short Break: {settings.shortBreakMinutes} minutes</Label>
        <Slider
          defaultValue={[settings.shortBreakMinutes]}
          min={1}
          max={15}
          step={1}
          onValueChange={(value) => 
            setSettings(prev => ({ ...prev, shortBreakMinutes: value[0] }))
          }
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm">Long Break: {settings.longBreakMinutes} minutes</Label>
        <Slider
          defaultValue={[settings.longBreakMinutes]}
          min={10}
          max={30}
          step={5}
          onValueChange={(value) => 
            setSettings(prev => ({ ...prev, longBreakMinutes: value[0] }))
          }
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm">Long Break after: {settings.longBreakInterval} sessions</Label>
        <Slider
          defaultValue={[settings.longBreakInterval]}
          min={2}
          max={6}
          step={1}
          onValueChange={(value) => 
            setSettings(prev => ({ ...prev, longBreakInterval: value[0] }))
          }
        />
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <Label htmlFor="notification-sound" className="text-sm">Sound Notification</Label>
        <Switch
          id="notification-sound"
          checked={settings.notificationSound}
          onCheckedChange={(checked) => 
            setSettings(prev => ({ ...prev, notificationSound: checked }))
          }
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="notification-visual" className="text-sm">Visual Notification</Label>
        <Switch
          id="notification-visual"
          checked={settings.notificationVisual}
          onCheckedChange={(checked) => 
            setSettings(prev => ({ ...prev, notificationVisual: checked }))
          }
        />
      </div>
    </div>
  );
}

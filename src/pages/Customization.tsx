
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  Brain, 
  Layout, 
  ArrowRight, 
  Check as CheckIcon, 
  Settings, 
  Sliders,
  Type,
  Palette
} from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type UserType = "productivity" | "cognitive" | "comprehensive";
type ThemeMode = "light" | "dark" | "system";
type LayoutPreference = "standard" | "simplified" | "focused";

const Customization = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [enableSwipe, setEnableSwipe] = useState(true);
  const [enableSoundEffects, setEnableSoundEffects] = useState(true);
  const [layoutPreference, setLayoutPreference] = useState<LayoutPreference>("standard");

  const handleSave = () => {
    // In a real app, we'd save these preferences to the user's profile
    toast.success("Preferences saved successfully!");
    navigate("/dashboard");
  };

  const userTypes = [
    {
      id: "productivity",
      title: "Productivity Focus",
      description: "I want to be more organized and productive in my daily life",
      icon: <Layout className="h-10 w-10 text-primary" />,
    },
    {
      id: "cognitive",
      title: "Cognitive Support",
      description: "I need support with memory and cognitive challenges",
      icon: <Brain className="h-10 w-10 text-primary" />,
    },
    {
      id: "comprehensive",
      title: "Comprehensive Solution",
      description: "I want the full MyRhythm experience with all features",
      icon: <Check className="h-10 w-10 text-primary" />,
    },
  ];

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
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <PageHeader
          title="Customize Your Experience"
          subtitle="Adjust settings to make MyRhythm work best for you"
        />

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences">Profile Type</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Type</CardTitle>
                <CardDescription>Select the option that best matches your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userTypes.map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedType === type.id
                          ? "border-2 border-primary shadow-lg"
                          : "border border-border"
                      }`}
                      onClick={() => setSelectedType(type.id as UserType)}
                    >
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="rounded-full bg-primary/10 p-2">{type.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{type.title}</CardTitle>
                        </div>
                        {selectedType === type.id && (
                          <CheckIcon className="ml-auto h-5 w-5 text-primary" />
                        )}
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{type.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
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
                    onValueChange={(value) => setTheme(value as ThemeMode)}
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
                    onValueChange={(value) => setLayoutPreference(value as LayoutPreference)}
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
                      onCheckedChange={setEnableSwipe}
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
                      onCheckedChange={setEnableSoundEffects}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Play subtle sound effects for notifications and interactions
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accessibility" className="mt-6">
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
                      onValueChange={(values) => setFontSize(values[0])}
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
                      onCheckedChange={setHighContrast}
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
                      onCheckedChange={setReduceMotion}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions throughout the app
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-8">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Customization;

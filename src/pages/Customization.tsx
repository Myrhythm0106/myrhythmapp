
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CustomizationHeader } from "@/components/customization/CustomizationHeader";
import { ProfileTypeStep } from "@/components/customization/ProfileTypeStep";
import { AppearanceStep } from "@/components/customization/AppearanceStep";
import { AccessibilityStep } from "@/components/customization/AccessibilityStep";
import { CompletionDialog } from "@/components/customization/CompletionDialog";

type UserType = "productivity" | "cognitive" | "comprehensive";
type ThemeMode = "light" | "dark" | "system";
type LayoutPreference = "standard" | "simplified" | "focused" | "customizable";

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
  const [activeTab, setActiveTab] = useState("preferences");
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const handleSave = () => {
    // Save layout preference to localStorage
    localStorage.setItem('dashboardLayout', layoutPreference);
    localStorage.setItem('userType', selectedType || '');
    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('theme', theme);
    localStorage.setItem('reduceMotion', reduceMotion.toString());
    localStorage.setItem('highContrast', highContrast.toString());
    localStorage.setItem('enableSwipe', enableSwipe.toString());
    localStorage.setItem('enableSoundEffects', enableSoundEffects.toString());
    
    toast.success("Preferences saved successfully!");
  };

  const handleProfileTypeNext = () => {
    setActiveTab("appearance");
  };

  const handleAppearanceNext = () => {
    setActiveTab("accessibility");
  };

  const handleAccessibilityComplete = () => {
    handleSave();
    setShowCompletionDialog(true);
  };

  const handleDialogComplete = () => {
    setShowCompletionDialog(false);
    navigate("/calendar");
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <CustomizationHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences">Profile Type</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="mt-6">
            <ProfileTypeStep
              selectedType={selectedType}
              onTypeSelect={setSelectedType}
              onNext={handleProfileTypeNext}
            />
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <AppearanceStep
              theme={theme}
              onThemeChange={setTheme}
              layoutPreference={layoutPreference}
              onLayoutChange={setLayoutPreference}
              enableSwipe={enableSwipe}
              onSwipeChange={setEnableSwipe}
              enableSoundEffects={enableSoundEffects}
              onSoundEffectsChange={setEnableSoundEffects}
              onNext={handleAppearanceNext}
            />
          </TabsContent>
          
          <TabsContent value="accessibility" className="mt-6">
            <AccessibilityStep
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              highContrast={highContrast}
              onHighContrastChange={setHighContrast}
              reduceMotion={reduceMotion}
              onReduceMotionChange={setReduceMotion}
              onComplete={handleAccessibilityComplete}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CompletionDialog 
        open={showCompletionDialog} 
        onComplete={handleDialogComplete} 
      />
    </div>
  );
};

export default Customization;


import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileForm } from "@/components/profile/UserProfileForm";
import { MedicalInfoForm } from "@/components/profile/MedicalInfoForm";
import { EmergencyContactsForm } from "@/components/profile/EmergencyContactsForm";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { PrivacySettings } from "@/components/profile/PrivacySettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User, Bell, HeartPulse, Settings, CheckCircle, Calendar } from "lucide-react";
import { FloatingStartButton } from "@/components/welcome/FloatingStartButton";
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("personal");
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  // Check if we're coming from onboarding flow
  useEffect(() => {
    const fromOnboarding = searchParams.get('from') === 'onboarding';
    if (fromOnboarding) {
      setShowFloatingButton(true);
    }
    
    // Load completed tabs from localStorage
    const savedCompletedTabs = JSON.parse(localStorage.getItem("myrhythm_profile_completed_tabs") || "[]");
    setCompletedTabs(savedCompletedTabs);
  }, [searchParams]);

  const markTabCompleted = (tabName: string) => {
    if (!completedTabs.includes(tabName)) {
      const newCompletedTabs = [...completedTabs, tabName];
      setCompletedTabs(newCompletedTabs);
      localStorage.setItem("myrhythm_profile_completed_tabs", JSON.stringify(newCompletedTabs));
      
      // Check if all tabs are completed
      const allTabs = ["personal", "medical", "emergency", "notifications", "privacy"];
      if (newCompletedTabs.length === allTabs.length) {
        localStorage.setItem("myrhythm_profile_complete", "true");
        toast({
          title: "Profile Complete!",
          description: "Your profile is now complete. You can start using MyRhythm!",
          variant: "default",
        });
      }
    }
  };

  const handlePersonalSave = () => {
    markTabCompleted("personal");
    setActiveTab("medical");
  };

  const handleMedicalSave = () => {
    markTabCompleted("medical");
    setActiveTab("emergency");
  };

  const handleEmergencySave = () => {
    markTabCompleted("emergency");
    setActiveTab("notifications");
  };

  const handleNotificationsSave = () => {
    markTabCompleted("notifications");
    setActiveTab("privacy");
  };

  const handlePrivacySave = () => {
    markTabCompleted("privacy");
    
    // Show completion message and redirect to calendar
    toast({
      title: "Profile Setup Complete!",
      description: "Welcome to MyRhythm! You're now ready to start scheduling your actions.",
      variant: "default",
    });
    
    setTimeout(() => {
      navigate("/calendar");
    }, 2000);
  };

  const isTabCompleted = (tabName: string) => completedTabs.includes(tabName);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Profile" 
        subtitle="Complete your personal information, medical data, and application preferences to personalise your MyRhythm experience"
      >
        {completedTabs.length === 5 && (
          <Button onClick={() => navigate("/calendar")} className="gap-2">
            <Calendar className="h-4 w-4" />
            Go to Calendar
          </Button>
        )}
      </PageHeader>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {isTabCompleted("personal") && <CheckCircle className="h-3 w-3 text-green-600" />}
                <span className="hidden md:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4" />
                {isTabCompleted("medical") && <CheckCircle className="h-3 w-3 text-green-600" />}
                <span className="hidden md:inline">Medical</span>
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {isTabCompleted("emergency") && <CheckCircle className="h-3 w-3 text-green-600" />}
                <span className="hidden md:inline">Emergency</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {isTabCompleted("notifications") && <CheckCircle className="h-3 w-3 text-green-600" />}
                <span className="hidden md:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {isTabCompleted("privacy") && <CheckCircle className="h-3 w-3 text-green-600" />}
                <span className="hidden md:inline">Privacy</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <UserProfileForm onSave={handlePersonalSave} />
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-4">
              <MedicalInfoForm onSave={handleMedicalSave} />
            </TabsContent>
            
            <TabsContent value="emergency" className="space-y-4">
              <EmergencyContactsForm onSave={handleEmergencySave} />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <NotificationSettings onSave={handleNotificationsSave} />
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <PrivacySettings onSave={handlePrivacySave} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Show floating button if coming from onboarding */}
      {showFloatingButton && <FloatingStartButton />}
    </div>
  );
};

export default Profile;

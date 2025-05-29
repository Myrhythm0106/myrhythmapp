
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
import { Shield, User, Bell, HeartPulse, Settings } from "lucide-react";
import { FloatingStartButton } from "@/components/welcome/FloatingStartButton";

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("personal");
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  // Check if we're coming from onboarding flow
  useEffect(() => {
    const fromOnboarding = searchParams.get('from') === 'onboarding';
    if (fromOnboarding) {
      setShowFloatingButton(true);
    }
  }, [searchParams]);

  const handlePersonalSave = () => {
    setActiveTab("medical");
  };

  const handleMedicalSave = () => {
    setActiveTab("emergency");
  };

  const handleEmergencySave = () => {
    setActiveTab("notifications");
  };

  const handleNotificationsSave = () => {
    setActiveTab("privacy");
  };

  const handlePrivacySave = () => {
    navigate("/customization");
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal information, medical data, and application preferences"
      />
      
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4" />
                <span className="hidden md:inline">Medical</span>
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden md:inline">Emergency</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden md:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
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

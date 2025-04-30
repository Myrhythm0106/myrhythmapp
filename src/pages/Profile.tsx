
import React, { useState } from "react";
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

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");

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
              <UserProfileForm />
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-4">
              <MedicalInfoForm />
            </TabsContent>
            
            <TabsContent value="emergency" className="space-y-4">
              <EmergencyContactsForm />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <PrivacySettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

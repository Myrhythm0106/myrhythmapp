
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Calendar, Shield, Bell, Edit } from "lucide-react";

const Profile = () => {
  const userInfo = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    joinDate: "January 8, 2024",
    userType: "Brain Injury Recovery",
    subscription: "Premium Plan"
  };

  const securitySettings = [
    { label: "Two-Factor Authentication", enabled: true },
    { label: "Email Notifications", enabled: true },
    { label: "SMS Alerts", enabled: false },
    { label: "Data Backup", enabled: true }
  ];

  const emergencyContacts = [
    { name: "Dr. Michael Chen", relationship: "Primary Doctor", phone: "(555) 234-5678" },
    { name: "Lisa Johnson", relationship: "Sister", phone: "(555) 345-6789" },
    { name: "Emergency Services", relationship: "Emergency", phone: "911" }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-lg">SJ</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{userInfo.name}</h3>
                <p className="text-sm text-muted-foreground">{userInfo.userType}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Edit className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={userInfo.name} />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={userInfo.email} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue={userInfo.phone} />
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since {userInfo.joinDate}</span>
              </div>
            </div>

            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {securitySettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {setting.label === "Two-Factor Authentication" && <Shield className="h-4 w-4" />}
                  {setting.label === "Email Notifications" && <Mail className="h-4 w-4" />}
                  {setting.label === "SMS Alerts" && <Bell className="h-4 w-4" />}
                  {setting.label === "Data Backup" && <Shield className="h-4 w-4" />}
                  <span className="text-sm">{setting.label}</span>
                </div>
                <div className={`w-10 h-6 rounded-full border-2 transition-colors ${
                  setting.enabled 
                    ? 'bg-primary border-primary' 
                    : 'bg-gray-200 border-gray-300'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    setting.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </div>
            ))}

            <div className="space-y-2 pt-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Download My Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">{contact.relationship}</div>
                </div>
                <div className="text-sm font-mono">{contact.phone}</div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Add Emergency Contact
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription & Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{userInfo.subscription}</div>
                  <div className="text-sm text-muted-foreground">Active until Feb 8, 2024</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">$19.99/month</div>
                  <div className="text-sm text-green-600">Auto-renew ON</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                View Billing History
              </Button>
              <Button variant="outline" className="w-full">
                Update Payment Method
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

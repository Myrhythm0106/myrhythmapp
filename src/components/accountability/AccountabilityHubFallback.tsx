
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Bell, Settings, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AccountabilityHubFallback() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Accountability Hub
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your support network for consistent progress and empowerment
        </p>
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-gray-600">Loading your accountability features...</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Support Circle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Manage your support team and care partners
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/accountability/support-circle")}
            >
              Manage Circle
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-500" />
              Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Set up helpful reminders and check-ins
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/accountability/reminders")}
            >
              View Reminders
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Configure your accountability preferences
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/accountability/settings")}
            >
              Manage Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

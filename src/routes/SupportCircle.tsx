import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, Phone, MessageCircle, Calendar, Shield } from 'lucide-react';

const SupportCircle = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Support Circle
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with family, friends, and caregivers. Share your progress, get support, and build a network of care around your cognitive wellness journey.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Add Family Member</h3>
              <p className="text-sm text-gray-600 mb-4">Invite loved ones to your support network</p>
              <Button variant="outline" size="sm">
                Send Invitation
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Share Update</h3>
              <p className="text-sm text-gray-600 mb-4">Let your circle know how you're doing</p>
              <Button variant="outline" size="sm">
                Post Update
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Schedule Check-in</h3>
              <p className="text-sm text-gray-600 mb-4">Plan regular touchpoints with supporters</p>
              <Button variant="outline" size="sm">
                Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Circle Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Your Support Circle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Demo Member */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah (Spouse)</h4>
                    <p className="text-sm text-gray-600">Primary caregiver • Active supporter</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add more members prompt */}
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-600 mb-2">Grow Your Support Circle</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Invite family members, friends, or caregivers to join your support network
                </p>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Someone
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Privacy & Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Share PACT Progress</h4>
                  <p className="text-sm text-gray-600">Allow circle members to see your promise tracking</p>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Emergency Contacts</h4>
                  <p className="text-sm text-gray-600">Automatic notifications in case of missed check-ins</p>
                </div>
                <Button size="sm" variant="outline">Set Up</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Data Sharing Preferences</h4>
                  <p className="text-sm text-gray-600">Control what information is visible to your circle</p>
                </div>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SupportCircle;
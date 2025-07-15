
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Bell, Shield, Heart, MessageSquare, Calendar } from "lucide-react";

const Accountability = () => {
  const supportCircle = [
    { name: "Sarah (Mom)", role: "Primary Caregiver", status: "Active", avatar: "S" },
    { name: "Dr. Johnson", role: "Therapist", status: "Active", avatar: "DJ" },
    { name: "Mike (Brother)", role: "Support", status: "Pending", avatar: "M" }
  ];

  const recentAlerts = [
    { type: "Medication Reminder", time: "2 hours ago", status: "Completed" },
    { type: "Therapy Session", time: "Yesterday", status: "Attended" },
    { type: "Daily Check-in", time: "3 days ago", status: "Missed" }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Accountability & Support
        </h1>
        <p className="text-lg text-muted-foreground">
          Stay connected with your support network and track your progress together
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Your Support Circle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {supportCircle.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  member.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {member.status}
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Add Support Member
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{alert.type}</div>
                  <div className="text-sm text-muted-foreground">{alert.time}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  alert.status === 'Completed' || alert.status === 'Attended'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {alert.status}
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="h-5 w-5 mr-2" />
              Safety Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Regular check-ins help your support circle know you're doing well
            </p>
            <Button className="w-full">Send Check-in</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="h-5 w-5 mr-2" />
              Quick Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Send updates or ask for help from your support team
            </p>
            <Button variant="outline" className="w-full">Compose Message</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Heart className="h-5 w-5 mr-2" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Quick access to emergency contacts when you need immediate support
            </p>
            <Button variant="destructive" className="w-full">Emergency Help</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accountability;

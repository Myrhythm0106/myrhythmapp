
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, MessageCircle, UserPlus, Calendar, Shield } from "lucide-react";

export default function PersonalCommunityPage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                My Support Circle
              </h1>
              <p className="text-muted-foreground">Your Personal Memory1st & LEAP Support Network</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-orange-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-orange-600" />
                Core Support Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">JD</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">Dr. Jane Doe</span>
                    <p className="text-xs text-muted-foreground">Primary Care Physician</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">MS</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">Mark Smith</span>
                    <p className="text-xs text-muted-foreground">Therapy Partner</p>
                  </div>
                  <Badge variant="secondary">Weekly</Badge>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Support Person
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-red-600" />
                Recent Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Family Check-in</span>
                    <span className="text-xs text-muted-foreground">Today</span>
                  </div>
                  <p className="text-xs">Shared LEAP progress and received encouraging feedback.</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Therapy Session</span>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-xs">Discussed Memory1st strategies and mood improvements.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                Upcoming Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Dr. Appointment</span>
                    <Badge variant="secondary">Tomorrow</Badge>
                  </div>
                  <p className="text-xs">Monthly progress review and Memory1st adjustment</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Family Call</span>
                    <Badge variant="secondary">This Weekend</Badge>
                  </div>
                  <p className="text-xs">Weekly LEAP journey sharing and encouragement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 text-orange-600 mx-auto" />
              <h3 className="text-xl font-semibold">Your Safe Support Network</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Memory1st believes in the power of gentle, understanding support. Your personal circle 
                provides the encouragement and accountability needed for your LEAP journey, 
                respecting your pace and celebrating every step forward.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">5</div>
                  <div className="text-xs text-muted-foreground">Support People</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <div className="text-xs text-muted-foreground">Check-ins This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">98%</div>
                  <div className="text-xs text-muted-foreground">Positive Feedback</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}

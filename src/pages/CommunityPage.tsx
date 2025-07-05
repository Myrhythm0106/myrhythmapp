
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Heart, Share2, Calendar, Star } from "lucide-react";

export default function CommunityPage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MyRhythm Community
              </h1>
              <p className="text-muted-foreground">Connect, Share, and LEAP Forward Together</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-purple-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                Memory1st Support Circle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Share experiences, gentle progress, and encouraging words with others on their Memory1st journey.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">248 members</Badge>
                <Button size="sm">Join Circle</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                LEAP Success Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Celebrate victories, big and small, as we all LEAP forward in our empowerment journeys.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">156 stories</Badge>
                <Button size="sm">Share Story</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                Group Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Join virtual sessions, workshops, and gentle activities designed with Memory1st principles.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Next: Today 3pm</Badge>
                <Button size="sm">View Schedule</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Heart className="h-12 w-12 text-purple-600 mx-auto" />
              <h3 className="text-xl font-semibold">Together We LEAP</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our community is built on Memory1st principles - gentle, supportive, and empowering. 
                Every small step forward is celebrated, every challenge is met with understanding, 
                and every victory helps others LEAP toward their goals.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Share2 className="w-4 h-4 mr-2" />
                Join the Movement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}

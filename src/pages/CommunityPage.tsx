
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Heart, Share2, Calendar, Star, Brain, Sparkles } from "lucide-react";

export default function CommunityPage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                MyRhythm Community
              </h1>
              <p className="text-lg text-muted-foreground">Memory1st → LEAP Forward Together</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our supportive community where Memory1st principles guide gentle, empowering connections 
            and shared journeys toward cognitive wellness and personal empowerment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                Memory1st Support Circle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Share experiences, gentle progress, and encouraging words with others on their Memory1st journey.
                Connect with peers who understand the gentle path to cognitive wellness.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Users className="h-3 w-3 mr-1" />
                  248 members
                </Badge>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Join Circle
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                LEAP Success Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Celebrate victories, big and small, as we all LEAP forward in our empowerment journeys.
                Every story inspires and motivates others on their path.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  156 stories
                </Badge>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  Share Story
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500 bg-gradient-to-br from-teal-50 to-emerald-100/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                Memory1st Group Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Join virtual sessions, workshops, and gentle activities designed with Memory1st principles.
                Learn together in a supportive, brain-friendly environment.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                  <Calendar className="h-3 w-3 mr-1" />
                  Next: Today 3pm
                </Badge>
                <Button size="sm" className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                  View Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Brain className="h-12 w-12 text-purple-600 mx-auto" />
                <h3 className="text-xl font-semibold">Memory1st Community Principles</h3>
                <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                  <li>• Gentle, supportive interactions that honor cognitive differences</li>
                  <li>• Memory-first approach to all community activities</li>
                  <li>• Celebration of small wins and gradual progress</li>
                  <li>• Brain-friendly communication and understanding</li>
                  <li>• Empowerment through shared experiences and wisdom</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-teal-200/50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Heart className="h-12 w-12 text-teal-600 mx-auto" />
                <h3 className="text-xl font-semibold">Together We LEAP</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Our community is built on Memory1st principles - gentle, supportive, and empowering. 
                  Every small step forward is celebrated, every challenge is met with understanding, 
                  and every victory helps others LEAP toward their goals.
                </p>
                <Button className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Join the Movement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm opacity-90">Community Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">1.2K</div>
                  <div className="text-sm opacity-90">Success Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm opacity-90">Weekly Sessions</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold">Ready to Connect?</h3>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Join thousands who have found their rhythm, built lasting connections, 
                and created meaningful progress through our Memory1st community approach.
              </p>
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                <Users className="w-5 h-5 mr-2" />
                Get Started Today
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}

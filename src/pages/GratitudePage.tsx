
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Star, Calendar, Smile } from "lucide-react";

export default function GratitudePage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Gratitude Practice
              </h1>
              <p className="text-muted-foreground">Memory1st Appreciation for Your LEAP Journey</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-pink-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-pink-600" />
                Today's Gratitude
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                What gentle moments of progress can you appreciate today? Memory1st gratitude builds neural pathways of positivity.
              </p>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Gratitude Entry
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-rose-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-rose-600" />
                LEAP Appreciation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                  <span className="text-sm">Today's small victory</span>
                  <Badge variant="secondary">New</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <span className="text-sm">Progress with Memory1st approach</span>
                  <Badge variant="secondary">Yesterday</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                  <span className="text-sm">Supportive community moment</span>
                  <Badge variant="secondary">2 days ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-pink-50 to-rose-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Smile className="h-12 w-12 text-pink-600 mx-auto" />
              <h3 className="text-xl font-semibold">Gentle Appreciation</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Memory1st gratitude practice recognizes that healing and growth happen gradually. 
                Each moment of appreciation strengthens your brain's ability to notice progress 
                and empowers your continued LEAP forward.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">7</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">23</div>
                  <div className="text-xs text-muted-foreground">Total Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">92%</div>
                  <div className="text-xs text-muted-foreground">Mood Lift</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}

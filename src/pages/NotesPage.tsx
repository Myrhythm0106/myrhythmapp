
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, Calendar, Tag, Star } from "lucide-react";

export default function NotesPage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Memory1st Notes & Reflections
              </h1>
              <p className="text-muted-foreground">Capture Your LEAP Journey Insights</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-l-4 border-l-amber-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-amber-600" />
                Quick Capture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Gently capture thoughts, insights, and Memory1st observations as they come to you.
              </p>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-yellow-600" />
                Find & Organize
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Easily search through your LEAP journey reflections and organize by themes.
              </p>
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search Notes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-orange-600" />
                Favorites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Mark important insights and breakthrough moments in your Memory1st journey.
              </p>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">7</div>
                <p className="text-xs text-muted-foreground">Starred Notes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Recent Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">LEAP Progress Reflection</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Today</Badge>
                      <Star className="h-3 w-3 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Noticed improved focus during Memory1st exercises. Feeling more confident about...
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Gratitude Insights</span>
                    <Badge variant="secondary">Yesterday</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Small moments of appreciation are building stronger neural pathways...
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Mood Pattern Discovery</span>
                    <Badge variant="secondary">3 days ago</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Morning routine seems to have the biggest positive impact on daily mood...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-600" />
                Note Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">Memory1st Insights</span>
                  </div>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">LEAP Progress</span>
                  </div>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Daily Reflections</span>
                  </div>
                  <Badge variant="secondary">15</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <span className="text-sm">Breakthrough Moments</span>
                  </div>
                  <Badge variant="secondary">5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 text-amber-600 mx-auto" />
              <h3 className="text-xl font-semibold">Your Memory1st Journal</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Notes and reflections are powerful tools in your Memory1st approach. They help process experiences, 
                track patterns, and celebrate progress. Each entry becomes part of your LEAP journey story, 
                building a gentle archive of growth, insights, and empowering moments.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">42</div>
                  <div className="text-xs text-muted-foreground">Total Notes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">7</div>
                  <div className="text-xs text-muted-foreground">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">5</div>
                  <div className="text-xs text-muted-foreground">Favorites</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}

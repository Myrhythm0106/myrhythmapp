
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";
import { FeatureCategories } from "@/components/dashboard/FeatureCategories";

export default function Dashboard() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Welcome to MyRhythm
              </h1>
              <p className="text-muted-foreground">Your Memory1st Journey to LEAP Forward</p>
            </div>
          </div>
        </div>

        {/* Enhanced Feature Categories */}
        <FeatureCategories />

        {/* Inspirational Footer */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your Memory1st → LEAP Journey</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every gentle step you take with Memory1st principles builds the foundation for your empowered LEAP forward. 
              Your brain is healing, your confidence is growing, and your potential is unlimited.
            </p>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}

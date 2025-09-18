import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  Compass, 
  HandHeart,
  CheckCircle,
  Clock,
  Brain,
  Calendar,
  Users,
  ChevronRight,
  Sparkles,
  Target
} from "lucide-react";

interface PathSelectionFlowProps {
  onPathSelected: (path: 'guided' | 'explorer') => void;
  onBack?: () => void;
}

export function PathSelectionFlow({ onPathSelected, onBack }: PathSelectionFlowProps) {
  const [selectedPath, setSelectedPath] = useState<'guided' | 'explorer' | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePathSelect = (path: 'guided' | 'explorer') => {
    setSelectedPath(path);
    setShowPreview(true);
  };

  const handleConfirm = () => {
    if (selectedPath) {
      onPathSelected(selectedPath);
    }
  };

  const handleBackToSelection = () => {
    setShowPreview(false);
    setSelectedPath(null);
  };

  const guidedPathFeatures = [
    { icon: <Brain className="h-4 w-4" />, title: "5-minute personalized assessment", desc: "We'll understand your unique needs" },
    { icon: <HandHeart className="h-4 w-4" />, title: "Step-by-step feature tour", desc: "We'll show you Memory Bridge and other key tools" },
    { icon: <Target className="h-4 w-4" />, title: "Personalized recommendations", desc: "Based on your assessment results" },
    { icon: <Calendar className="h-4 w-4" />, title: "Setup your first Memory Bridge recording", desc: "We'll help you get started right away" }
  ];

  const explorerPathFeatures = [
    { icon: <Compass className="h-4 w-4" />, title: "Free exploration", desc: "Jump straight into any feature you're curious about" },
    { icon: <Sparkles className="h-4 w-4" />, title: "Quick feature overview", desc: "See all available tools at a glance" },
    { icon: <Users className="h-4 w-4" />, title: "Self-paced discovery", desc: "Explore Memory Bridge and other features on your terms" },
    { icon: <CheckCircle className="h-4 w-4" />, title: "Optional assessment", desc: "Take it whenever you're ready" }
  ];

  if (showPreview && selectedPath) {
    const isGuided = selectedPath === 'guided';
    const features = isGuided ? guidedPathFeatures : explorerPathFeatures;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-beacon-50/30 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-3xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center">
                  {isGuided ? <HandHeart className="h-8 w-8 text-white" /> : <Compass className="h-8 w-8 text-white" />}
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent mb-2">
                  {isGuided ? 'Guided Journey' : 'Explorer Mode'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {isGuided 
                    ? 'Perfect! We\'ll take care of everything step by step' 
                    : 'Great choice! You\'ll have full freedom to explore'
                  }
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-semibold text-center">Here's what to expect:</h3>
                
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-beacon-50 to-indigo-50 rounded-lg">
                      <div className="w-8 h-8 bg-beacon-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {feature.icon}
                          <h4 className="font-semibold">{feature.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">
                        {isGuided ? 'Time commitment: ~10 minutes' : 'No time pressure'}
                      </h4>
                      <p className="text-sm text-blue-700">
                        {isGuided 
                          ? 'We\'ll have you recording your first Memory Bridge conversation in just a few minutes'
                          : 'Explore at your own pace. You can always come back to the guided tour later'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handleBackToSelection}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Choose Different Path
                </Button>

                <Button onClick={handleConfirm} className="bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900">
                  {isGuided ? 'Start Guided Journey' : 'Begin Exploring'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center p-4 text-sm text-muted-foreground">
          Lost? Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd> to search anything
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-beacon-50/30 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent mb-4">
                Choose Your Journey
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                How would you like to get started with MyRhythm? Both paths lead to the same destination - 
                a better organized, more connected life.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Guided Path */}
              <Card 
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 border-transparent hover:border-beacon-200"
                onClick={() => handlePathSelect('guided')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center">
                    <HandHeart className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Guided Journey</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">Recommended for first-time users</Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 text-center">
                    "Take my hand - I'll show you everything step by step"
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Personalized assessment first</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Feature tour based on your needs</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Setup Memory Bridge together</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Custom recommendations</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900"
                    onClick={() => handlePathSelect('guided')}
                  >
                    I want guidance
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Explorer Path */}
              <Card 
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 border-transparent hover:border-beacon-200"
                onClick={() => handlePathSelect('explorer')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Compass className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Explorer Mode</CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">For independent users</Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 text-center">
                    "I want to discover features at my own pace"
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Jump straight to any feature</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Explore Memory Bridge freely</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Self-paced learning</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Assessment when you're ready</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full mt-6 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => handlePathSelect('explorer')}
                  >
                    Let me explore
                    <Compass className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Back Button */}
            {onBack && (
              <div className="flex justify-center">
                <Button variant="ghost" onClick={onBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center p-4 text-sm text-muted-foreground">
        Lost? Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd> to search anything
      </div>
    </div>
  );
}
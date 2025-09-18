import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Target,
  Star,
  Zap
} from "lucide-react";

interface IntegratedPathSelectionProps {
  onBack?: () => void;
}

export function IntegratedPathSelection({ onBack }: IntegratedPathSelectionProps) {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<'guided' | 'explorer' | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePathSelect = (path: 'guided' | 'explorer') => {
    setSelectedPath(path);
    setShowPreview(true);
  };

  const handleConfirm = () => {
    if (selectedPath === 'guided') {
      // Start with assessment then guided journey
      navigate('/mvp/assessment-flow?path=guided&next=guided-journey');
    } else if (selectedPath === 'explorer') {
      // Go directly to explorer mode
      navigate('/explorer');
    }
  };

  const handleBackToSelection = () => {
    setShowPreview(false);
    setSelectedPath(null);
  };

  const guidedPathFeatures = [
    { icon: <Brain className="h-4 w-4" />, title: "5-minute personalized assessment", desc: "We'll understand your unique cognitive recovery needs" },
    { icon: <HandHeart className="h-4 w-4" />, title: "AI-powered setup assistance", desc: "We'll configure Memory Bridge and other tools for you" },
    { icon: <Target className="h-4 w-4" />, title: "Brain injury-focused recommendations", desc: "Based on your specific challenges and goals" },
    { icon: <Calendar className="h-4 w-4" />, title: "Your first Memory Bridge recording", desc: "We'll help you capture your first conversation" }
  ];

  const explorerPathFeatures = [
    { icon: <Compass className="h-4 w-4" />, title: "Direct access to all 7 core features", desc: "Memory Bridge, Calendar, A.C.T.S Reports, Brain Games & more" },
    { icon: <Sparkles className="h-4 w-4" />, title: "Self-paced discovery", desc: "Explore Memory Bridge and support tools at your own speed" },
    { icon: <Users className="h-4 w-4" />, title: "Optional guidance anytime", desc: "Switch to guided mode whenever you're ready" },
    { icon: <CheckCircle className="h-4 w-4" />, title: "Assessment when you want", desc: "Take it now, later, or skip entirely" }
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
                <Badge variant="secondary" className="mt-2">
                  {isGuided ? 'Recommended for brain injury recovery' : 'Perfect for independent users'}
                </Badge>
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
                        {isGuided ? 'Time: ~10 minutes to full setup' : 'No time pressure - explore freely'}
                      </h4>
                      <p className="text-sm text-blue-700">
                        {isGuided 
                          ? 'We\'ll have your Memory Bridge capturing conversations in just a few minutes'
                          : 'Jump into any feature immediately. Assessment and guidance available anytime'
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
                  {isGuided ? 'Start Assessment & Guided Setup' : 'Enter Explorer Mode'}
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
              <Badge className="bg-gradient-to-r from-beacon-500 to-beacon-700 text-white mb-4">
                <Brain className="h-4 w-4 mr-2" />
                Brain Injury Recovery Platform
              </Badge>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent mb-4">
                Choose Your Recovery Journey
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                How would you like to access your 7 core recovery features? Both paths give you full access to Memory Bridge, 
                A.C.T.S Reports, Brain Games, Support Circle, Calendar, Reminders, and Dashboard.
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
                  <Badge variant="secondary" className="w-fit mx-auto">Recommended for brain injury recovery</Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 text-center">
                    "Take my hand - I'll show you everything step by step"
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Start with personalized assessment</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">AI setup for Memory Bridge & tools</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Brain injury-specific recommendations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Immediate first recording session</span>
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
                      <span className="text-sm">Immediate access to all 7 features</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Start with Memory Bridge or any tool</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Self-paced learning & discovery</span>
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

            {/* Core Features Preview */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-center mb-6">Your 7 Core Recovery Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                {[
                  { name: 'Memory Bridge', icon: <Brain className="h-4 w-4" /> },
                  { name: 'Calendar', icon: <Calendar className="h-4 w-4" /> },
                  { name: 'A.C.T.S Reports', icon: <Target className="h-4 w-4" /> },
                  { name: 'Brain Games', icon: <Zap className="h-4 w-4" /> },
                  { name: 'Reminders', icon: <Clock className="h-4 w-4" /> },
                  { name: 'Support Circle', icon: <Users className="h-4 w-4" /> },
                  { name: 'Dashboard', icon: <Star className="h-4 w-4" /> }
                ].map((feature, index) => (
                  <div key={index} className="text-xs">
                    <div className="w-8 h-8 mx-auto mb-1 bg-gray-100 rounded-lg flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <span className="text-gray-600">{feature.name}</span>
                  </div>
                ))}
              </div>
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
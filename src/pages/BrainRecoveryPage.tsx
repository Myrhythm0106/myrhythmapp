
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Activity, 
  Heart, 
  Zap, 
  Target, 
  Clock,
  TrendingUp,
  Shield,
  Lightbulb,
  CheckCircle
} from "lucide-react";

export default function BrainRecoveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Brain Recovery Center
            </h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Advanced cognitive rehabilitation tools designed specifically for brain injury recovery and cognitive enhancement using the LEAP methodology.
          </p>
        </div>

        {/* Recovery Status */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Activity className="h-5 w-5" />
              Recovery Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">74%</div>
                <div className="text-sm text-blue-700">Overall Recovery</div>
                <Progress value={74} className="mt-2 h-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">42</div>
                <div className="text-sm text-purple-700">Days Active</div>
                <Progress value={85} className="mt-2 h-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-900">8.2</div>
                <div className="text-sm text-green-700">Cognitive Score</div>
                <Progress value={82} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LEAP Methodology */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800 text-lg">
                <Lightbulb className="h-5 w-5" />
                L - Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700 mb-3">
                Adaptive learning exercises that adjust to your cognitive level and progress.
              </p>
              <Badge className="bg-orange-100 text-orange-800">
                12 Exercises Active
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800 text-lg">
                <Target className="h-5 w-5" />
                E - Engage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700 mb-3">
                Interactive activities that keep your brain actively engaged in recovery.
              </p>
              <Badge className="bg-green-100 text-green-800">
                Daily 45min
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
                <TrendingUp className="h-5 w-5" />
                A - Adapt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 mb-3">
                Personalized therapy that adapts to your unique recovery journey.
              </p>
              <Badge className="bg-blue-100 text-blue-800">
                AI-Powered
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-800 text-lg">
                <Shield className="h-5 w-5" />
                P - Protect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-700 mb-3">
                Neuroprotective strategies to safeguard and strengthen your brain.
              </p>
              <Badge className="bg-purple-100 text-purple-800">
                24/7 Monitoring
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Today's Recovery Plan */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Today's Recovery Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium text-green-800">Memory Exercise</div>
                    <div className="text-sm text-green-700">Pattern recognition - 15 min</div>
                  </div>
                  <Badge className="bg-green-600 text-white">Complete</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-blue-800">Attention Training</div>
                    <div className="text-sm text-blue-700">Focus exercises - 20 min</div>
                  </div>
                  <Badge className="bg-blue-600 text-white">In Progress</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Target className="h-5 w-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">Problem Solving</div>
                    <div className="text-sm text-gray-700">Logic puzzles - 25 min</div>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Zap className="h-4 w-4 mr-2" />
                Continue Recovery Session
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Cognitive Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Processing Speed</span>
                    <span className="text-green-600 font-medium">Improving</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">78% of baseline</div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Working Memory</span>
                    <span className="text-blue-600 font-medium">Stable</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">65% of baseline</div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Executive Function</span>
                    <span className="text-yellow-600 font-medium">Progressing</span>
                  </div>
                  <Progress value={72} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">72% of baseline</div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attention Span</span>
                    <span className="text-green-600 font-medium">Strong</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">85% of baseline</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recovery Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery Tools & Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-sm font-medium">Memory Games</span>
                <span className="text-xs text-gray-600">12 available</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Target className="h-8 w-8 text-green-600" />
                <span className="text-sm font-medium">Attention Training</span>
                <span className="text-xs text-gray-600">8 exercises</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Zap className="h-8 w-8 text-yellow-600" />
                <span className="text-sm font-medium">Speed Tests</span>
                <span className="text-xs text-gray-600">6 challenges</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Activity className="h-8 w-8 text-purple-600" />
                <span className="text-sm font-medium">Neuro Feedback</span>
                <span className="text-xs text-gray-600">Real-time</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

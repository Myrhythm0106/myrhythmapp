
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Book, 
  Play, 
  HelpCircle, 
  Target, 
  Brain,
  Calendar,
  Heart,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Lightbulb
} from "lucide-react";

export default function UserGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Book className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              MyRhythm User Guide
            </h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Master your MyRhythm experience with our comprehensive guide. Learn how to maximize your cognitive wellness journey.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Play className="h-5 w-5" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-emerald-200">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-emerald-800 mb-2">Set Your Goals</h3>
                <p className="text-sm text-emerald-700">Define your daily "Today I Will..." focus and track your progress</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-emerald-200">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-teal-800 mb-2">Track Daily</h3>
                <p className="text-sm text-teal-700">Log your mood, complete brain exercises, and practice gratitude</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-emerald-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Build Support</h3>
                <p className="text-sm text-blue-700">Connect with your support circle and share your journey</p>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Play className="h-4 w-4 mr-2" />
              Start Interactive Tutorial
            </Button>
          </CardContent>
        </Card>

        {/* Feature Guides */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Goals & Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Setting SMART goals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Tracking daily progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Celebrating milestones</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Adjusting goals based on progress</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                View Goals Guide
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Brain Games & Recovery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Choosing the right exercises</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Understanding LEAP methodology</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Tracking cognitive improvements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Setting recovery goals</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                View Brain Games Guide
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Calendar & Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Creating daily routines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Setting reminders and alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Syncing with external calendars</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Managing appointments</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                View Calendar Guide
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Mood & Wellness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Daily mood tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Gratitude practice techniques</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Identifying patterns and triggers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Building positive habits</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                View Wellness Guide
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tips & Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Tips & Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">Daily Habits</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Start each day by setting your "Today I Will..." goal</li>
                  <li>• Complete at least one brain exercise daily</li>
                  <li>• Log your mood and energy levels consistently</li>
                  <li>• Practice gratitude before bedtime</li>
                  <li>• Review your progress weekly</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">Maximizing Recovery</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Follow the LEAP methodology consistently</li>
                  <li>• Gradually increase exercise difficulty</li>
                  <li>• Take breaks between intensive sessions</li>
                  <li>• Connect with your support network regularly</li>
                  <li>• Celebrate small wins and progress</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support & FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Support & FAQ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Users className="h-5 w-5" />
                <span>Community Support</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1">
                <HelpCircle className="h-5 w-5" />
                <span>Frequently Asked Questions</span>
              </Button>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">
                Need additional help? Our support team is here for you.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

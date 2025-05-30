
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Calendar, 
  HeartPulse, 
  Users, 
  Home,
  Settings,
  BookOpen,
  Target,
  Timer,
  MessageSquare,
  Shield,
  Bell,
  Camera,
  MapPin,
  Gamepad2,
  Lightbulb,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";

export function MyRhythmAppDocumentation() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">MyRhythm App Documentation</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive guide to all features and functionality in MyRhythm - your personalised brain recovery and wellness companion
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="brain">Brain</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6" />
                MyRhythm Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                MyRhythm is a comprehensive brain recovery and wellness platform designed to help individuals rebuild their daily routines, track their progress, and maintain their cognitive health through structured activities and community support.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Core Principles</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Target className="h-4 w-4 mt-1 text-primary" />
                      <span>Personalised rhythm assessment and adaptation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 mt-1 text-primary" />
                      <span>Progress tracking and 6-month reassessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 mt-1 text-primary" />
                      <span>Community support and shared experiences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 mt-1 text-primary" />
                      <span>Privacy-first approach to health data</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Target Users</h3>
                  <ul className="space-y-2">
                    <li>• Brain injury survivors</li>
                    <li>• Individuals with cognitive challenges</li>
                    <li>• People rebuilding daily routines</li>
                    <li>• Caregivers and support networks</li>
                    <li>• Healthcare professionals</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Onboarding Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Step 1</Badge>
                    <h3 className="font-semibold">Personal Information</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Basic profile setup including name, email, and account credentials.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Step 2</Badge>
                    <h3 className="font-semibold">Location Setup</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Geographic information for localised services and timezone configuration.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Step 3</Badge>
                    <h3 className="font-semibold">Plan Selection</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Choose from Basic, Premium, or Professional plans based on needs.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Step 4</Badge>
                    <h3 className="font-semibold">Payment Processing</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Secure payment setup for subscription management.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Step 5</Badge>
                    <h3 className="font-semibold">Rhythm Assessment</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive 8-section assessment covering current challenges, cognitive function, emotional state, 
                    support systems, progress recognition, goal setting, self-perception, and community engagement. 
                    Results stored for 6-month comparison tracking.
                  </p>
                  <div className="mt-2">
                    <Badge variant="secondary">Auto-progression enabled</Badge>
                    <span className="text-xs ml-2">Automatically advances to next question after selection</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-6 w-6" />
                Dashboard Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Daily Management</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Daily check-in and mood tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>Today's priorities and focus areas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span>Upcoming actions and reminders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>Energy level indicators</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Progress Tracking</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>Routine completion tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HeartPulse className="h-4 w-4 text-primary" />
                      <span>Symptom monitoring and insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <span>Gratitude practice integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4 text-primary" />
                      <span>Brain game quick access</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Calendar & Action Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Action Scheduling</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Create and schedule daily actions</li>
                    <li>• Link actions to specific goals</li>
                    <li>• Set reminders and notifications</li>
                    <li>• Add location and media attachments</li>
                    <li>• Assign watchers for accountability</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Goal Management</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Create structured goal hierarchies</li>
                    <li>• Track goal progress and completion</li>
                    <li>• Analyse goal sufficiency</li>
                    <li>• View organised goal boards</li>
                    <li>• Link daily actions to long-term goals</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Calendar Views</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Day view with detailed scheduling</li>
                    <li>• Week view with timeline overview</li>
                    <li>• Goals view for strategic planning</li>
                    <li>• Storyboard view for reflection</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Medication Reminders</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Automated medication scheduling</li>
                    <li>• Dosage and timing tracking</li>
                    <li>• Refill reminders</li>
                    <li>• Medication history logging</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-6 w-6" />
                Health & Wellness Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Mood Tracking</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Daily mood check-ins with energy levels</li>
                    <li>• Mood history visualisation</li>
                    <li>• Correlation analysis with activities</li>
                    <li>• Weekly and monthly mood summaries</li>
                    <li>• Share insights with support circle</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Symptom Monitoring</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Log cognitive and physical symptoms</li>
                    <li>• Track symptom patterns over time</li>
                    <li>• Identify triggers and improvements</li>
                    <li>• Generate reports for healthcare providers</li>
                    <li>• Set severity and frequency tracking</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Gratitude Practice</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Daily gratitude journaling</li>
                    <li>• Guided gratitude exercises</li>
                    <li>• Gratitude word cloud visualisation</li>
                    <li>• Progress tracking and insights</li>
                    <li>• Integration with mood data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6" />
                Brain Recovery & Cognitive Training
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Brain Games Library</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Memory training exercises</li>
                    <li>• Pattern recognition games</li>
                    <li>• Spatial awareness challenges</li>
                    <li>• Sequence memory training</li>
                    <li>• Matching and recall exercises</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Progress Tracking</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Daily memory workout recommendations</li>
                    <li>• Performance analytics and trends</li>
                    <li>• Difficulty progression tracking</li>
                    <li>• Streak maintenance and rewards</li>
                    <li>• Cognitive improvement insights</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Pomodoro Timer</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Customisable work/break intervals</li>
                    <li>• Focus session tracking</li>
                    <li>• Productivity analytics</li>
                    <li>• Background timer support</li>
                    <li>• Integration with daily actions</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Recovery Resources</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Educational content library</li>
                    <li>• Recovery strategy guides</li>
                    <li>• Expert advice and tips</li>
                    <li>• Local service directories</li>
                    <li>• Emergency resource access</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Community & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Support Circles</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Create private support groups</li>
                    <li>• Share progress and experiences</li>
                    <li>• Controlled privacy settings</li>
                    <li>• Message and update sharing</li>
                    <li>• Emergency contact integration</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Community Forums</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Public discussion boards</li>
                    <li>• Expert Q&A sessions</li>
                    <li>• Success story sharing</li>
                    <li>• Peer support and advice</li>
                    <li>• Moderated safe spaces</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Member Features</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Member directory and profiles</li>
                    <li>• Direct messaging system</li>
                    <li>• Group creation and management</li>
                    <li>• Event coordination and planning</li>
                    <li>• Mentorship programme access</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Profile & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Basic profile details and preferences</li>
                    <li>• Avatar and display customisation</li>
                    <li>• Timezone and location settings</li>
                    <li>• Accessibility preferences</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Medical Information</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Health conditions and medications</li>
                    <li>• Healthcare provider contacts</li>
                    <li>• Medical history and notes</li>
                    <li>• Allergy and sensitivity tracking</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Emergency Contacts</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Primary and secondary contacts</li>
                    <li>• Emergency service information</li>
                    <li>• Medical emergency instructions</li>
                    <li>• Crisis intervention resources</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Notifications & Privacy</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Custom notification schedules</li>
                    <li>• Privacy level controls</li>
                    <li>• Data sharing preferences</li>
                    <li>• Communication settings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Data Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Data Protection</h3>
              <ul className="space-y-1 text-sm">
                <li>• End-to-end encryption for sensitive data</li>
                <li>• GDPR compliance and data rights</li>
                <li>• Secure local storage options</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">User Control</h3>
              <ul className="space-y-1 text-sm">
                <li>• Granular privacy controls</li>
                <li>• Data export and deletion</li>
                <li>• Consent management</li>
                <li>• Transparent data usage</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

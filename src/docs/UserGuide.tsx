
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, 
  Calendar, 
  HeartPulse, 
  Brain, 
  User, 
  Users, 
  Heart, 
  Info, 
  Search,
  Clock,
  FileText,
  Download,
  Home
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

export function UserGuide() {
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "MyRhythm User Guide",
  });

  return (
    <div className="max-w-5xl mx-auto py-8 text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">MyRhythm User Guide</h1>
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          <span>Export as PDF</span>
        </Button>
      </div>
      
      <div ref={componentRef} className="space-y-8 p-4">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Introduction</h2>
          <p className="text-foreground">
            Welcome to MyRhythm, your personal wellness and productivity companion. 
            This guide will walk you through all the features and tools available in 
            the application to help you organize your life, track your health, and
            improve your overall wellbeing.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-foreground">
              <p><strong>1.</strong> Access your Dashboard to see your daily overview</p>
              <p><strong>2.</strong> Use the Calendar to manage your events and appointments</p>
              <p><strong>3.</strong> Track your health metrics in the Health Tracking section</p>
              <p><strong>4.</strong> Explore brain recovery tools for cognitive wellness</p>
              <p><strong>5.</strong> Connect with others in the Community section</p>
            </CardContent>
          </Card>
        </section>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="w-full flex justify-between overflow-x-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-1">
              <HeartPulse className="w-4 h-4" />
              <span>Health</span>
            </TabsTrigger>
            <TabsTrigger value="brain" className="flex items-center gap-1">
              <Brain className="w-4 h-4" />
              <span>Brain</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Community</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4 mt-4">
            <h3 className="text-xl font-medium text-foreground">Dashboard Features</h3>
            <p className="text-foreground">
              The Dashboard is your central hub that provides an overview of your day.
              Here you can find important information at a glance and quickly access
              key features.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Daily Check-in</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Record your daily mood, energy level, and thoughts. Tracking these metrics helps you understand patterns in your wellbeing over time.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Symptom Tracker</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Monitor health symptoms and see how they correlate with your activities, sleep, and other factors.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Community Updates</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Stay connected with your support network and see the latest posts and activities.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Gratitude Practice</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Take a moment for daily reflection with guided gratitude prompts that help improve mental wellbeing.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Focus Goals</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>View your current goals and track your progress toward achieving them.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>See what's coming up on your calendar so you're always prepared for the day ahead.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="border p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2 text-foreground">Mobile Tips</h4>
              <p className="text-foreground">On mobile devices, your dashboard features are available in a swipeable carousel. Simply swipe left or right to navigate through the different cards.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4 mt-4">
            <h3 className="text-xl font-medium text-foreground">Calendar Features</h3>
            <p className="text-foreground">
              The Calendar helps you organize your schedule, set reminders, and manage your time effectively.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Week View</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>See your whole week at a glance with color-coded events and appointments.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Day View</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Detailed hourly breakdown of your day's schedule and commitments.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Goals View</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Track your progress on short and long-term goals with visual indicators.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Storyboard</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Visualize your journey with a timeline of key events and milestones.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="border p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2 text-foreground">Gesture Controls</h4>
              <p className="text-foreground">On touchscreen devices, swipe left and right to navigate between days or weeks. Pinch to zoom in and out of different calendar views.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4 mt-4">
            <h3 className="text-xl font-medium text-foreground">Health Tracking Features</h3>
            <p className="text-foreground">
              Monitor your symptoms, medications, and health metrics to better understand your body and mind.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Symptom Log</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Record symptoms as they occur, noting intensity, duration, and possible triggers.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Symptom History</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Review your symptom history with visualizations to identify patterns over time.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Symptom Insights</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Receive personalized insights about potential correlations between symptoms and lifestyle factors.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Medication Reminders</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Set up reminders for medications and track adherence to prescribed schedules.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="brain" className="space-y-4 mt-4">
            <h3 className="text-xl font-medium text-foreground">Brain Recovery Features</h3>
            <p className="text-foreground">
              Tools and activities designed to support cognitive health and recovery.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Brain Games</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Engage with cognitive exercises designed to strengthen various aspects of brain function.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Memory Match</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>A classic memory game to improve recall and concentration with adjustable difficulty levels.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Daily Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Personalized cognitive activities suggested based on your recovery progress and needs.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Monitor improvements in cognitive performance over time with detailed metrics.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="community" className="space-y-4 mt-4">
            <h3 className="text-xl font-medium text-foreground">Community Features</h3>
            <p className="text-foreground">
              Connect with others, share experiences, and build a support network.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Message Board</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Share thoughts, questions, and insights with your community in a safe, supportive environment.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Expert Q&A</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Access to healthcare professionals who can answer questions and provide guidance.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Community Groups</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Join specialized groups based on shared experiences, conditions, or interests.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Personal Community</CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p>Connect with your personal support network including family, friends, and caregivers.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Additional Features</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                <CardTitle className="text-foreground">Global Search</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground">
                <p>Quickly find anything in the app using the search function. Access it by clicking the search icon or pressing Ctrl+K (Cmd+K on Mac).</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <CardTitle className="text-foreground">Pomodoro Timer</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground">
                <p>Enhance productivity with the built-in Pomodoro technique timer. Set focused work sessions and breaks to maintain concentration.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <CardTitle className="text-foreground">Gratitude Journal</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground">
                <p>Record daily moments of gratitude to improve mental wellbeing and build a positive mindset over time.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle className="text-foreground">Resources</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground">
                <p>Access helpful guides, FAQs, tutorials, and official documents to get the most out of the application.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Mobile Experience</h2>
          <p className="text-foreground">
            MyRhythm is fully optimized for mobile devices, with special features to enhance the experience on phones and tablets:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="bg-primary rounded-full p-1 mt-1">
                <span className="text-xs text-primary-foreground font-bold">1</span>
              </div>
              <p className="text-foreground"><strong>Swipeable interfaces</strong> - Navigate through cards, calendar views, and content with intuitive swipe gestures.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary rounded-full p-1 mt-1">
                <span className="text-xs text-primary-foreground font-bold">2</span>
              </div>
              <p className="text-foreground"><strong>Mobile navigation</strong> - Easy access menu available from any screen for quick navigation.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary rounded-full p-1 mt-1">
                <span className="text-xs text-primary-foreground font-bold">3</span>
              </div>
              <p className="text-foreground"><strong>Responsive layouts</strong> - All screens automatically adjust to your device size for optimal viewing.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary rounded-full p-1 mt-1">
                <span className="text-xs text-primary-foreground font-bold">4</span>
              </div>
              <p className="text-foreground"><strong>Touch-friendly controls</strong> - Larger touch targets and intuitive interactions designed for touch screens.</p>
            </div>
          </div>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Getting Support</h2>
          <p className="text-foreground">
            If you need assistance with MyRhythm, there are several ways to get help:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">In-App Resources</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground">
                <p>Visit the Resources section for user guides, FAQs, and tutorial videos.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground">
                <p>Reach out to our support team through the Help & Support section in the app.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>MyRhythm User Guide • Last Updated: {new Date().toLocaleDateString()}</p>
          <p>This guide is provided for users of the MyRhythm application. All features described may be subject to updates or changes.</p>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { TutorialModal } from "@/components/tutorial/TutorialModal";

const Welcome = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/60 to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-8">
          <ShieldCheck className="h-12 w-12 text-beacon-600" />
          <h1 className="text-4xl font-bold">Welcome to MyRhythm</h1>
        </div>
        
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Your Journey Begins Now</CardTitle>
            <CardDescription>
              MyRhythm is designed to help you build better habits and routines, track your progress,
              and achieve your goals. Here's what you can expect:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="one-month" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="one-month">1 Month</TabsTrigger>
                <TabsTrigger value="three-months">3 Months</TabsTrigger>
                <TabsTrigger value="six-months">6 Months</TabsTrigger>
              </TabsList>
              
              <TabsContent value="one-month" className="space-y-4 mt-6">
                <h3 className="text-xl font-medium">First Month: Building Your Foundation</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Establish your daily rhythm with consistent check-ins</li>
                  <li>Set up your first routines and begin tracking your progress</li>
                  <li>Connect your goals with actionable daily tasks</li>
                  <li>Begin recognizing patterns in your productivity and mood</li>
                  <li>Join a supportive community of like-minded individuals</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="three-months" className="space-y-4 mt-6">
                <h3 className="text-xl font-medium">Three Months: Deepening Your Practice</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>See clear progress in your habit formation journey</li>
                  <li>Benefit from personalized insights based on your data</li>
                  <li>Refine your routines based on what works best for you</li>
                  <li>Experience increased focus and productivity in daily tasks</li>
                  <li>Share your successes with the community and inspire others</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="six-months" className="space-y-4 mt-6">
                <h3 className="text-xl font-medium">Six Months: Mastering Your Rhythm</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Enjoy the benefits of deeply ingrained positive habits</li>
                  <li>Use advanced insights to further optimize your day</li>
                  <li>Track meaningful progress toward your long-term goals</li>
                  <li>Experience improved well-being through consistent routines</li>
                  <li>Become a valued mentor in the MyRhythm community</li>
                </ul>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-medium">Ready to explore MyRhythm?</h3>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setShowTutorial(true)}
                  className="gap-2"
                >
                  Take a Tour <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                  className="gap-2"
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <TutorialModal isOpen={showTutorial} onComplete={() => {
        setShowTutorial(false);
        navigate("/dashboard");
      }} />
    </div>
  );
};

export default Welcome;

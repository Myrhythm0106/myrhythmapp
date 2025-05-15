import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calendar, CheckCircle2, Heart, HeartHandshake, Lightbulb, SquareDashedBottomCode, Star, Target, Sparkles } from "lucide-react";
import { GameCard } from "@/components/brain-games/components/GameCard";
import { gameTypes } from "@/components/brain-games/data/gamesData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function BrainRecoveryHome() {
  const navigate = useNavigate();
  
  // Get a recommended game for quick start
  const recommendedGame = gameTypes[1]; // Memory Match game is ideal for new users
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4">
      {/* Hero Section with clearer visual hierarchy */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-beacon-600 to-beacon-800 text-white p-6 md:p-10">
        <div className="absolute right-0 bottom-0 opacity-10">
          <Brain size={280} />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            🧠 MyRhythm: Reclaim Structure. Reignite Confidence.
          </h1>
          
          <p className="text-xl opacity-90">
            Your personalised path to rebuilding your rhythm and reclaiming your day.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 italic mt-6">
            <p className="text-sm md:text-base">
              💬 "After my brain aneurysm, remembering simple things felt impossible. With my husband's support, we rebuilt a rhythm that gave us back our peace. That rhythm became MyRhythm. Now, it's here for you, your loved ones, and your care team."
            </p>
            <p className="text-sm font-medium mt-2">
              — Bella A., Brain Health Coach & Brain Aneurysm Survivor
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              size="lg"
              className="bg-white text-beacon-800 hover:bg-white/90"
              onClick={() => navigate("/onboarding")}
            >
              👉 Get Started Now
            </Button>
          </div>
        </div>
      </section>
      
      {/* Essential Features Section - Limited to 3 crucial elements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Your Essential Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Focus Card */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                My Focus Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded border flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span>Complete 10-minute meditation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded border flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                  </div>
                  <span>Take morning medication</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded border"></div>
                  <span>Call doctor for appointment</span>
                </li>
              </ul>
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => navigate("/dashboard")}>
                View All Tasks
              </Button>
            </CardContent>
          </Card>
          
          {/* Brain Game */}
          <Card className="border-l-4 border-l-amber-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-amber-500" />
                Quick Brain Exercise
              </CardTitle>
              <CardDescription>
                A short activity to boost your cognitive skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/20 p-2 rounded-md">
                    <Lightbulb className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">{recommendedGame.name}</p>
                    <p className="text-sm text-muted-foreground">5-minute session</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => navigate("/dashboard")}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start Exercise
              </Button>
            </CardContent>
          </Card>
          
          {/* Routine Check-in */}
          <Card className="border-l-4 border-l-green-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Today's Routine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Progress</span>
                  <span className="font-medium">2/4</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <span>Morning Medication</span>
                  <span className="text-xs text-muted-foreground ml-auto">8:00 AM</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <span>15 Min Walk</span>
                  <span className="text-xs text-muted-foreground ml-auto">10:00 AM</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="border p-1 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>Evening Medication</span>
                  <span className="text-xs text-muted-foreground ml-auto">8:00 PM</span>
                </li>
              </ul>
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => navigate("/dashboard")}>
                View Full Routine
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Why MyRhythm Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Why MyRhythm for Brain Recovery?
        </h2>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <p className="text-lg">
                ✨ Built for Brain Recovery. Backed by Real Experience.
              </p>
              
              <p>
                Whether you're living with memory challenges, supporting someone who is, or delivering care, 
                MyRhythm offers a simple, supportive way to bring structure and calm to each day.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg inline-flex">
                    <Brain className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium">For Individuals</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1" />
                      <span>Stay On Track: Daily reminders, routines, and goals at your pace</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1" />
                      <span>Regain Confidence: Celebrate progress and rebuild trust in your memory</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-purple-50 p-3 rounded-lg inline-flex">
                    <Heart className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-medium">For Family & Carers</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 mt-1" />
                      <span>See the Day, Stay Connected: View schedules and add notes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 mt-1" />
                      <span>Be a Partner, Not a Planner: Support without burnout</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg inline-flex">
                    <HeartHandshake className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium">For Medical Professionals</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                      <span>Monitor Without Hovering: See patient engagement patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                      <span>Promote Holistic Healing: Align goals and recovery practices</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 mt-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  How different features work together
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your daily check-ins help identify energy patterns, which inform your routine timing, 
                  while brain games strengthen cognitive skills needed for daily tasks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Our Story Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">🌱 Our Story, Now Yours Too</h2>
        
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-beacon-100 to-beacon-300 p-6 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full">
                <Brain className="h-16 w-16 text-beacon-600" />
              </div>
            </div>
            
            <CardContent className="md:w-2/3 p-6">
              <p className="mb-4">
                After my injury, our home was filled with sticky notes, alarms, missed moments and tension. 
                My husband became my reminder, planner and alarm. But what we needed wasn't more noise—it was 
                shared rhythm. That's how MyRhythm was born.
              </p>
              
              <p className="text-lg font-medium text-beacon-700 italic">
                "It's not just about remembering. It's about rising."
              </p>
              
              <div className="mt-6">
                <Button 
                  onClick={() => navigate("/onboarding")}
                  className="bg-beacon-600 hover:bg-beacon-700"
                >
                  Join Us Now
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>
      
      {/* Call to Action Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">👨‍👩‍👧‍👦 Be Part of Our Community</h2>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <p className="text-lg font-medium">Join our waitlist and be the first to try MyRhythm as a:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="border-2 border-blue-300 bg-white hover:bg-blue-50"
                  onClick={() => navigate("/onboarding?type=survivor")}
                >
                  ✅ Survivor
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-blue-300 bg-white hover:bg-blue-50"
                  onClick={() => navigate("/onboarding?type=family")}
                >
                  ✅ Family Member/Carer
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-blue-300 bg-white hover:bg-blue-50"
                  onClick={() => navigate("/onboarding?type=medical")}
                >
                  ✅ Medical Professional
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-center sm:text-left text-muted-foreground">
                  Let's rebuild your rhythm together
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                  onClick={() => navigate("/onboarding")}
                >
                  🕊 Start Your Recovery Journey
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MyRhythm - Empowering brain injury recovery through personalized structure
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Button variant="link" size="sm" className="text-xs" onClick={() => navigate("/useful-info")}>
              Resources
            </Button>
            <Button variant="link" size="sm" className="text-xs" onClick={() => navigate("/community")}>
              Community
            </Button>
            <Button variant="link" size="sm" className="text-xs" onClick={() => navigate("/useful-info?tab=faq")}>
              FAQ
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

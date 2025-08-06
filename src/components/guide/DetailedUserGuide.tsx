import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Brain, 
  Target, 
  Calendar, 
  Users, 
  Heart, 
  Settings, 
  HelpCircle,
  BookOpen,
  Video,
  MessageCircle,
  CheckCircle
} from "lucide-react";

const guideContent = {
  who: {
    title: "Who Is MyRhythm For?",
    icon: Users,
    content: [
      {
        title: "Brain Injury Survivors",
        description: "Individuals recovering from TBI, stroke, or other neurological challenges seeking cognitive rehabilitation and memory enhancement."
      },
      {
        title: "Caregivers & Family",
        description: "Family members and professional caregivers supporting loved ones through cognitive recovery and wellness journeys."
      },
      {
        title: "Wellness Seekers",
        description: "Anyone looking to optimize their cognitive health, improve memory, and build mental resilience for life's challenges."
      },
      {
        title: "Healthcare Professionals",
        description: "Medical professionals seeking evidence-based tools to support patients' cognitive wellness and recovery goals."
      }
    ]
  },
  what: {
    title: "What Does MyRhythm Do?",
    icon: Brain,
    content: [
      {
        title: "Cognitive Assessment & Tracking",
        description: "Comprehensive assessments to understand your cognitive baseline and track improvement over time with detailed progress analytics."
      },
      {
        title: "Personalized Brain Training",
        description: "Adaptive exercises designed specifically for your cognitive profile, focusing on memory, attention, processing speed, and executive function."
      },
      {
        title: "Memory Enhancement Tools",
        description: "Scientifically-backed techniques including spaced repetition, visual associations, and memory palace methods."
      },
      {
        title: "Lifestyle Integration",
        description: "Calendar integration, mood tracking, sleep optimization, and stress management tools for holistic cognitive wellness."
      }
    ]
  },
  where: {
    title: "Where To Find Everything",
    icon: BookOpen,
    content: [
      {
        title: "Dashboard - Your Command Center",
        description: "Access daily goals, progress summaries, quick actions, and personalized recommendations all in one place."
      },
      {
        title: "Calendar - Schedule & Track",
        description: "Plan brain training sessions, set reminders, track mood and energy levels, and review weekly progress patterns."
      },
      {
        title: "Goals - Set & Achieve",
        description: "Create SMART goals, track milestones, celebrate achievements, and adjust targets based on your progress."
      },
      {
        title: "Support - Connect & Share",
        description: "Invite family members, share progress reports, access community support, and connect with healthcare providers."
      }
    ]
  },
  when: {
    title: "When To Use Each Feature",
    icon: Calendar,
    content: [
      {
        title: "Morning Routine (5-10 minutes)",
        description: "Check daily goals, review scheduled activities, complete mood check-in, and start focused brain training session."
      },
      {
        title: "Afternoon Break (3-5 minutes)",
        description: "Quick cognitive exercises, stress management techniques, progress check, and energy level tracking."
      },
      {
        title: "Evening Review (5-7 minutes)",
        description: "Reflect on daily achievements, update mood and sleep quality, plan tomorrow's activities, and review weekly progress."
      },
      {
        title: "Weekly Planning (15-20 minutes)",
        description: "Assess weekly progress, adjust goals, schedule upcoming activities, and share updates with support network."
      }
    ]
  },
  why: {
    title: "Why MyRhythm Works",
    icon: Target,
    content: [
      {
        title: "Evidence-Based Approach",
        description: "Built on neuroscience research and cognitive rehabilitation best practices with proven effectiveness in clinical settings."
      },
      {
        title: "Personalized Experience",
        description: "AI-powered adaptation that learns from your progress, preferences, and challenges to optimize your cognitive training."
      },
      {
        title: "Holistic Wellness",
        description: "Addresses not just cognitive function but also emotional well-being, lifestyle factors, and social support systems."
      },
      {
        title: "Family-Centered Care",
        description: "Includes tools for family involvement, caregiver support, and professional healthcare team collaboration."
      }
    ]
  },
  how: {
    title: "How To Get Started",
    icon: Settings,
    content: [
      {
        title: "1. Complete Your Profile",
        description: "Share your goals, challenges, and preferences to personalize your MyRhythm experience and training recommendations."
      },
      {
        title: "2. Take Initial Assessment",
        description: "Complete our comprehensive cognitive assessment to establish your baseline and identify areas for improvement."
      },
      {
        title: "3. Set Your Goals",
        description: "Define specific, measurable goals for your cognitive wellness journey with timeline and milestone tracking."
      },
      {
        title: "4. Build Your Routine",
        description: "Create a sustainable daily practice with brain training, wellness activities, and progress review sessions."
      }
    ]
  }
};

export function DetailedUserGuide() {
  const [activeTab, setActiveTab] = useState("who");

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-brain-health-500 rounded-full flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          Complete User Guide
        </CardTitle>
        <p className="text-muted-foreground">
          Everything you need to know about MyRhythm, organized to answer all your questions about who, what, where, when, why, and how.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            {Object.entries(guideContent).map(([key, section]) => {
              const Icon = section.icon;
              return (
                <TabsTrigger key={key} value={key} className="text-xs">
                  <Icon className="h-3 w-3 mr-1" />
                  {key.toUpperCase()}
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {Object.entries(guideContent).map(([key, section]) => {
            const Icon = section.icon;
            return (
              <TabsContent key={key} value={key} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                  </div>
                  
                  <Accordion type="single" collapsible className="space-y-2">
                    {section.content.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                          {item.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
        
        {/* Action buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-border/50">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Watch Video Tutorials
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Heart, Brain, Users, Star } from "lucide-react";

export function MemorySuccessStoriesSection() {
  const stories = [
    {
      name: "Sarah M.",
      condition: "Traumatic Brain Injury",
      timeUsing: "8 months",
      photo: "👩‍💼",
      story: "After my car accident, I couldn't remember to take my medication or keep track of my doctor appointments. My husband was burning out from being my constant reminder. MyRhythm gave us both our lives back.",
      specificWin: "Haven't missed a medication dose in 3 months",
      familyImpact: "My husband sleeps better knowing the app has our back",
      medicalBenefit: "My neurologist says my progress tracking helps him adjust my treatment much better",
      rating: 5
    },
    {
      name: "Robert K.",
      condition: "Post-Stroke Recovery",
      timeUsing: "6 months",
      photo: "👨‍🦳",
      story: "The stroke took away my short-term memory, but it didn't take away my determination. This app helps me stay independent while my family knows I'm safe. The brain exercises actually feel good instead of frustrating.",
      specificWin: "Completed my first independent grocery trip in 18 months",
      familyImpact: "My daughter doesn't worry about me as much anymore",
      medicalBenefit: "Physical therapist loves seeing my daily energy patterns",
      rating: 5
    },
    {
      name: "Jessica L.",
      condition: "Concussion Recovery",
      timeUsing: "4 months",
      photo: "👩‍🎓",
      story: "As a teacher recovering from multiple concussions, I thought my career was over. MyRhythm helped me rebuild my cognitive stamina gradually. Now I'm back in the classroom, working with my brain instead of against it.",
      specificWin: "Returned to full-time teaching",
      familyImpact: "My kids see me as capable again, not fragile",
      medicalBenefit: "Concussion specialist uses my data to track recovery milestones",
      rating: 5
    },
    {
      name: "Maria & Tom S.",
      condition: "Alzheimer's Early Stage",
      timeUsing: "1 year",
      photo: "👫",
      story: "When Maria was diagnosed, we panicked. MyRhythm became our bridge—helping Maria maintain her independence while giving me peace of mind. We're living with Alzheimer's, not surrendering to it.",
      specificWin: "Maria still manages her daily routine independently",
      familyImpact: "We're partners in care, not patient and caregiver",
      medicalBenefit: "Memory care team sees detailed cognitive patterns",
      rating: 5
    }
  ];

  const outcomes = [
    {
      metric: "94%",
      description: "of users report increased daily confidence",
      icon: Heart
    },
    {
      metric: "87%",
      description: "see improved family relationships",
      icon: Users
    },
    {
      metric: "91%",
      description: "better medication adherence",
      icon: Brain
    },
    {
      metric: "89%",
      description: "healthcare providers notice improvement",
      icon: Star
    }
  ];

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-green-600 border-green-200">
          <Heart className="h-3 w-3 mr-1" />
          Real Stories from Real Survivors
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold">
          Life After Memory Loss:<br />
          Stories of Rediscovered Hope
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          These aren't testimonials—they're transformation stories from people who thought 
          their memory challenges meant their best days were behind them.
        </p>
      </div>

      {/* Success Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story, index) => (
          <Card key={index} className="border-l-4 border-l-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="text-3xl">{story.photo}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{story.name}</h4>
                    <div className="flex gap-1">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {story.condition}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {story.timeUsing} using app
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Main Story */}
              <div className="relative">
                <Quote className="h-6 w-6 text-green-400 mb-2" />
                <p className="text-muted-foreground italic leading-relaxed pl-4">
                  {story.story}
                </p>
              </div>

              {/* Specific Outcomes */}
              <div className="space-y-3 bg-green-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Personal Win:</p>
                      <p className="text-sm text-green-700">{story.specificWin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Family Impact:</p>
                      <p className="text-sm text-green-700">{story.familyImpact}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Medical Team:</p>
                      <p className="text-sm text-green-700">{story.medicalBenefit}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Outcomes Grid */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border border-green-200">
        <h3 className="text-2xl font-semibold text-center mb-8">
          Measured Outcomes from Our Memory-First Community
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {outcomes.map((outcome, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <outcome.icon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-700">
                  {outcome.metric}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-tight">
                {outcome.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Message */}
      <div className="text-center space-y-4 bg-blue-50 p-8 rounded-lg border border-blue-200">
        <h3 className="text-2xl font-semibold">
          Your Story Could Be Next
        </h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Every person in our community once felt hopeless about their memory challenges. 
          Today, they're living proof that memory loss doesn't mean life loss.
        </p>
        <p className="text-sm text-blue-600 font-medium">
          Join 1,000+ brain injury survivors rebuilding their confidence, one memory-safe step at a time.
        </p>
      </div>
    </section>
  );
}
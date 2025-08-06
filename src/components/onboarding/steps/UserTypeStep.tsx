import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Users, Sparkles, Stethoscope, CheckCircle, ArrowRight } from "lucide-react";
import { UserType } from "@/types/user";
import { BrainIllustration } from "@/components/ui/BrainIllustration";

interface UserTypeStepProps {
  onComplete: (data: { type: UserType }) => void;
  initialValue?: UserType | null;
}

const userTypes = [
  {
    id: "brain-injury" as const,
    title: "Brain Injury Recovery",
    description: "...you want to strengthen your mind after a challenging experience, or you're currently feeling like your cognitive abilities aren't what they used to be and you're searching for a way back to feeling like yourself again",
    icon: Brain,
    color: "bg-gradient-to-r from-brain-health-500 to-clarity-teal-500",
    problem: "Struggling with memory, focus, or cognitive clarity after brain injury",
    solution: "Personalized brain training, memory techniques, and cognitive rehabilitation tools",
    beforeAfter: {
      before: "Frustrated by memory lapses and cognitive fog",
      after: "Regaining confidence with improved memory and mental clarity"
    }
  },
  {
    id: "caregiver" as const,
    title: "Caregiver Support", 
    description: "...you want to build resilience and prevent burnout while supporting someone you love, or you're currently exhausted from holding it all together and need support too",
    icon: Heart,
    color: "bg-gradient-to-r from-rose-500 to-pink-500",
    problem: "Caregiver burnout and emotional exhaustion from supporting loved ones",
    solution: "Self-care tools, stress management, and caregiver community support",
    beforeAfter: {
      before: "Overwhelmed and depleted from constant caregiving",
      after: "Balanced and resilient with sustainable support strategies"
    }
  },
  {
    id: "cognitive-optimization" as const,
    title: "Cognitive Optimization",
    description: "...you want to build on your existing mental strengths and reach new levels of performance, or you know there's more potential locked inside your mind and you're ready to unlock peak mental performance",
    icon: Sparkles,
    color: "bg-gradient-to-r from-purple-500 to-violet-500",
    problem: "Hitting cognitive plateaus and underutilizing mental potential",
    solution: "Advanced brain training, cognitive enhancement protocols, and performance optimization",
    beforeAfter: {
      before: "Good performance but knowing you can achieve more",
      after: "Unlocking peak cognitive performance and mental agility"
    }
  },
  {
    id: "wellness" as const,
    title: "General Wellness",
    description: "...you want to proactively build mental resilience for life's challenges, or you're currently feeling scattered and want to create sustainable mental wellness",
    icon: Users,
    color: "bg-gradient-to-r from-emerald-500 to-teal-500",
    problem: "Feeling mentally scattered and lacking sustainable wellness habits",
    solution: "Holistic wellness tools, stress management, and cognitive resilience building",
    beforeAfter: {
      before: "Reactive mental health approach with inconsistent habits",
      after: "Proactive wellness mindset with sustainable daily practices"
    }
  },
  {
    id: "medical-professional" as const,
    title: "Medical Professional",
    description: "...you want to enhance your toolkit with evidence-based cognitive wellness resources, or you see the gaps in traditional care and want better tools to truly help your patients thrive",
    icon: Stethoscope,
    color: "bg-gradient-to-r from-teal-500 to-cyan-500",
    problem: "Limited tools for comprehensive cognitive care and patient engagement",
    solution: "Evidence-based cognitive assessments, patient tracking, and professional resources",
    beforeAfter: {
      before: "Traditional care approaches with limited cognitive tools",
      after: "Enhanced practice with comprehensive cognitive wellness capabilities"
    }
  },
  {
    id: "colleague" as const,
    title: "Colleague",
    description: "...you want to create a more supportive workplace environment for cognitive wellness, or you've witnessed how cognitive challenges impact your workplace family and want to create real change",
    icon: Users,
    color: "bg-gradient-to-r from-indigo-500 to-blue-500",
    problem: "Workplace mental health challenges and limited support resources",
    solution: "Workplace wellness programs, team cognitive health tools, and peer support systems",
    beforeAfter: {
      before: "Isolated workplace struggles with limited mental health support",
      after: "Collaborative, supportive work environment with cognitive wellness focus"
    }
  }
];

export function UserTypeStep({ onComplete, initialValue }: UserTypeStepProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(initialValue || null);

  console.log("UserTypeStep: Rendering with selectedType:", selectedType, "initialValue:", initialValue);

  // Update selectedType when initialValue changes
  useEffect(() => {
    if (initialValue && initialValue !== selectedType) {
      setSelectedType(initialValue);
    }
  }, [initialValue]);

  const handleSelection = (type: UserType) => {
    console.log("UserTypeStep: User selected type:", type);
    setSelectedType(type);
    // Call onComplete immediately when user selects a type
    onComplete({ type });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-6 px-4">
      {/* Brain illustration background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <BrainIllustration className="w-96 h-96" opacity={0.08} />
      </div>
      
      {/* Header */}
      <div className="relative text-center space-y-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-brain-health-500 via-primary to-clarity-teal-500 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brain-health-600 via-primary to-clarity-teal-600 bg-clip-text text-transparent">
            This is for you if...
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the path that speaks to your heart. We'll create a personalized journey that honors your unique story.
        </p>
        
        {/* Problem/Solution Overview */}
        <div className="bg-gradient-to-r from-brain-health-50/50 via-purple-50/30 to-clarity-teal-50/50 p-6 rounded-2xl border border-brain-health-200/30 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-brain-health-700">Transform Your Challenges Into Triumphs</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div>
                <p className="font-medium text-red-700">The Problem</p>
                <p className="text-muted-foreground">Feeling stuck, overwhelmed, or disconnected from your cognitive potential</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-emerald-700">Our Solution</p>
                <p className="text-muted-foreground">Personalized brain training, memory enhancement, and cognitive empowerment tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Type Cards */}
      <div className="grid gap-4 md:grid-cols-2 w-full">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 w-full ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleSelection(type.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold text-foreground mb-1">
                      {type.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                  
                  {/* Selection indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground/30'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
              </CardHeader>
              
              {isSelected && (
                <CardContent className="pt-0 pb-3">
                  <div className="flex items-center gap-2 text-primary">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">Selected - Ready to continue</span>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Selection Status */}
      {selectedType && (
        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20 max-w-2xl mx-auto">
          <p className="text-primary font-medium">
            ✓ {userTypes.find(t => t.id === selectedType)?.title} Selected
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Continue" below to proceed to the next step
          </p>
        </div>
      )}
    </div>
  );
}

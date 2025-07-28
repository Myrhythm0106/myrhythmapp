import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Brain, Heart, Users, Sparkles, Stethoscope, ChevronDown } from "lucide-react";
import { UserType } from "@/types/user";

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
    color: "bg-blue-500",
  },
  {
    id: "caregiver" as const,
    title: "Caregiver Support", 
    description: "...you want to build resilience and prevent burnout while supporting someone you love, or you're currently exhausted from holding it all together and need support too",
    icon: Heart,
    color: "bg-rose-500",
  },
  {
    id: "cognitive-optimization" as const,
    title: "Cognitive Optimization",
    description: "...you want to build on your existing mental strengths and reach new levels of performance, or you know there's more potential locked inside your mind and you're ready to unlock peak mental performance",
    icon: Sparkles,
    color: "bg-purple-500",
  },
  {
    id: "wellness" as const,
    title: "General Wellness",
    description: "...you want to proactively build mental resilience for life's challenges, or you're currently feeling scattered and want to create sustainable mental wellness",
    icon: Users,
    color: "bg-green-500",
  },
  {
    id: "medical-professional" as const,
    title: "Medical Professional",
    description: "...you want to enhance your toolkit with evidence-based cognitive wellness resources, or you see the gaps in traditional care and want better tools to truly help your patients thrive",
    icon: Stethoscope,
    color: "bg-teal-500",
  },
  {
    id: "colleague" as const,
    title: "Colleague",
    description: "...you want to create a more supportive workplace environment for cognitive wellness, or you've witnessed how cognitive challenges impact your workplace family and want to create real change",
    icon: Users,
    color: "bg-indigo-500",
  }
];

export function UserTypeStep({ onComplete, initialValue }: UserTypeStepProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(initialValue || null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-foreground">
          This is for you if...
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the path that speaks to your heart. We'll create a personalized journey that honors your unique story.
        </p>
      </div>

      {/* User Type Cards */}
      <div className="grid gap-4 md:grid-cols-2 w-full">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          const isExpanded = expandedCard === type.id;
          
          // Enhanced Brain Injury Recovery card with striking visual
          if (type.id === "brain-injury") {
            return (
              <div key={type.id} className="md:col-span-2">
                <Collapsible 
                  open={isExpanded} 
                  onOpenChange={(open) => setExpandedCard(open ? type.id : null)}
                >
                  <Card 
                    className={`overflow-hidden transition-all duration-300 hover:shadow-xl border-2 ${
                      isSelected 
                        ? 'border-brain-health-400 bg-brain-health-50/50 shadow-lg ring-2 ring-brain-health-400/20' 
                        : 'border-border hover:border-brain-health-300'
                    }`}
                  >
                    {/* Hero Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
                        alt="Neural network circuit board representing brain connectivity"
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-r from-brain-health-900/60 via-brain-health-800/40 to-brain-health-700/30"></div>
                      
                      {/* Content over image */}
                      <div className="absolute inset-0 flex flex-col justify-between p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-brain-health-500/90 backdrop-blur-sm flex items-center justify-center">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">{type.title}</h3>
                              <p className="text-brain-health-100 text-sm">Click to explore your journey</p>
                            </div>
                          </div>
                          
                          {/* Selection indicator */}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'border-white bg-white' 
                              : 'border-white/60 bg-white/10'
                          }`}>
                            {isSelected && <div className="w-3 h-3 rounded-full bg-brain-health-500"></div>}
                          </div>
                        </div>
                        
                        {/* Expand trigger */}
                        <CollapsibleTrigger className="flex items-center justify-center gap-2 text-white hover:text-brain-health-100 transition-colors group">
                          <span className="text-sm font-medium">
                            {isExpanded ? 'Show less' : 'Learn more about this path'}
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'
                          }`} />
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    
                    {/* Expandable content */}
                    <CollapsibleContent className="animate-accordion-down">
                      <CardContent className="p-6 bg-gradient-to-br from-brain-health-50/30 to-clarity-teal-50/20">
                        <div className="space-y-4">
                          <p className="text-foreground leading-relaxed">
                            {type.description}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelection(type.id);
                              }}
                              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'bg-brain-health-500 text-white shadow-md'
                                  : 'bg-brain-health-100 text-brain-health-700 hover:bg-brain-health-200'
                              }`}
                            >
                              {isSelected ? '✓ Selected' : 'Choose this path'}
                            </button>
                            
                            {isSelected && (
                              <div className="flex items-center gap-2 text-brain-health-600">
                                <div className="w-2 h-2 bg-brain-health-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Ready to continue your journey</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </div>
            );
          }
          
          // Regular cards for other types
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

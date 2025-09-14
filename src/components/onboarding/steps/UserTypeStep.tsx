import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Heart, Users, Sparkles, Stethoscope, Plus, Target, Leaf, Building2 } from "lucide-react";
import { UserType } from "@/types/user";

interface UserTypeStepProps {
  onComplete: (data: { type: UserType; customType?: string }) => void;
  initialValue?: UserType | null;
  onBack?: () => void;
}

const userTypes = [
  {
    id: "brain-injury" as const,
    title: "Brain Injury Recovery",
    description: "You are so much stronger than what happened to you. Let's rebuild your confidence, capture the conversations that matter, and create a rhythm that honors your unique healing journey.",
    icon: Brain,
    color: "bg-gradient-to-br from-brain-health-500 to-brain-health-600 hover:from-brain-health-600 hover:to-brain-health-700",
  },
  {
    id: "caregiver" as const,
    title: "Caregiver Support", 
    description: "Your love runs deep, but so does your exhaustion. You deserve tools that understand the weight you carry - capture important care moments and build resilience that sustains both you and your loved one.",
    icon: Heart,
    color: "bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600 hover:from-memory-emerald-600 hover:to-memory-emerald-700",
  },
  {
    id: "cognitive-optimization" as const,
    title: "Cognitive Optimization",
    description: "You know there's more inside you waiting to emerge. Memory Bridge captures your breakthrough moments while advanced training unlocks the brilliant mind you've always known you have.",
    icon: Target,
    color: "bg-gradient-to-br from-beacon-500 to-beacon-600 hover:from-beacon-600 hover:to-beacon-700",
  },
  {
    id: "wellness" as const,
    title: "General Wellness",
    description: "You have everything it takes to thrive. Build mental resilience with Memory Bridge conversation insights and sustainable wellness habits that honor your journey.",
    icon: Leaf,
    color: "bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600 hover:from-memory-emerald-600 hover:to-memory-emerald-700",
  },
  {
    id: "medical-professional" as const,
    title: "Medical Professional",
    description: "Your expertise matters, your time is precious. Streamline patient interactions with Memory Bridge conversation recording and evidence-based cognitive wellness resources for better outcomes.",
    icon: Stethoscope,
    color: "bg-gradient-to-br from-clarity-teal-500 to-clarity-teal-600 hover:from-clarity-teal-600 hover:to-clarity-teal-700",
  },
  {
    id: "colleague" as const,
    title: "Workplace Wellness",
    description: "You deserve to flourish at work. Empower your workplace with Memory Bridge for team meetings and cognitive wellness tools that help you and your colleagues thrive together.",
    icon: Building2,
    color: "bg-gradient-to-br from-sunrise-amber-500 to-sunrise-amber-600 hover:from-sunrise-amber-600 hover:to-sunrise-amber-700",
  },
  {
    id: "other" as const,
    title: "Other",
    description: "Tell us about your unique situation and we'll personalize MyRhythm for your specific needs",
    icon: Plus,
    color: "bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
  }
];

export function UserTypeStep({ onComplete, initialValue, onBack }: UserTypeStepProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(initialValue || null);
  const [customTypeText, setCustomTypeText] = useState<string>('');

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
    
    // For non-other types, call onComplete immediately
    if (type !== 'other') {
      onComplete({ type });
    }
  };

  const handleOtherComplete = () => {
    if (selectedType === 'other' && customTypeText.trim()) {
      onComplete({ type: 'other', customType: customTypeText.trim() });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-foreground">
          Your Story Matters. Your Recovery is Real.
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Every breakthrough starts with someone who truly understands your journey. We see you, we believe in you, and we're here to help.
        </p>
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
              
              {isSelected && type.id === 'other' && (
                <CardContent className="pt-0 pb-3 space-y-3">
                  <Input
                    placeholder="Please describe your situation..."
                    value={customTypeText}
                    onChange={(e) => setCustomTypeText(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                  {customTypeText.trim() && (
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium">Ready to continue</span>
                    </div>
                  )}
                </CardContent>
              )}
              
              {isSelected && type.id !== 'other' && (
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
            ✓ {selectedType === 'other' ? customTypeText || 'Other' : userTypes.find(t => t.id === selectedType)?.title} Selected
          </p>
          {selectedType === 'other' && !customTypeText.trim() ? (
            <p className="text-sm text-muted-foreground mt-1">
              Please describe your situation above to continue
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              Click "Continue" below to proceed to the next step
            </p>
          )}
          
          {selectedType === 'other' && customTypeText.trim() && (
            <button
              onClick={handleOtherComplete}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Continue with "{customTypeText}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

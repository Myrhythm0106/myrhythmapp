
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Heart, Compass, List, Settings } from "lucide-react";

export type UserType = 
  | "brain-health" 
  | "emotional-wellness" 
  | "clarity-focus" 
  | "productivity" 
  | "organization"
  | "custom";

interface UserTypeSelectorProps {
  selectedType: UserType | null;
  onChange: (type: UserType) => void;
  customType?: string;
  onCustomTypeChange?: (value: string) => void;
}

export const UserTypeSelector = ({ 
  selectedType, 
  onChange,
  customType = "",
  onCustomTypeChange = () => {}
}: UserTypeSelectorProps) => {
  const [showCustomField, setShowCustomField] = useState(selectedType === "custom");

  const handleSelectType = (type: UserType) => {
    onChange(type);
    setShowCustomField(type === "custom");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`p-6 cursor-pointer hover:border-primary transition-all ${selectedType === "brain-health" ? "border-2 border-primary" : ""}`}
          onClick={() => handleSelectType("brain-health")}
        >
          <div className="flex items-start gap-4">
            <Brain className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Brain Health Recovery</h3>
              <p className="text-muted-foreground text-sm">For those recovering from brain injury or conditions, focusing on mental rehabilitation and tracking progress.</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer hover:border-primary transition-all ${selectedType === "emotional-wellness" ? "border-2 border-primary" : ""}`}
          onClick={() => handleSelectType("emotional-wellness")}
        >
          <div className="flex items-start gap-4">
            <Heart className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Emotional Wellness</h3>
              <p className="text-muted-foreground text-sm">For those seeking balance in mood and emotions, with tools for mindfulness and emotional regulation.</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer hover:border-primary transition-all ${selectedType === "clarity-focus" ? "border-2 border-primary" : ""}`}
          onClick={() => handleSelectType("clarity-focus")}
        >
          <div className="flex items-start gap-4">
            <Compass className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Clarity & Focus</h3>
              <p className="text-muted-foreground text-sm">For those wanting to improve cognitive function, memory, and focus in daily activities.</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer hover:border-primary transition-all ${selectedType === "productivity" ? "border-2 border-primary" : ""}`}
          onClick={() => handleSelectType("productivity")}
        >
          <div className="flex items-start gap-4">
            <List className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Productivity Champion</h3>
              <p className="text-muted-foreground text-sm">For those seeking to maximize efficiency, complete tasks promptly, and achieve more in less time.</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer hover:border-primary transition-all ${selectedType === "organization" ? "border-2 border-primary" : ""}`}
          onClick={() => handleSelectType("organization")}
        >
          <div className="flex items-start gap-4">
            <Settings className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Organization Expert</h3>
              <p className="text-muted-foreground text-sm">For those wanting structured routines, methodical planning, and a comprehensive approach to life management.</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer hover:border-primary transition-all ${selectedType === "custom" ? "border-2 border-primary" : ""}`}
          onClick={() => handleSelectType("custom")}
        >
          <div className="flex items-start gap-4">
            <Settings className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Something Else</h3>
              <p className="text-muted-foreground text-sm">Tell us about your specific needs and goals so we can personalize your experience.</p>
            </div>
          </div>
        </Card>
      </div>

      {showCustomField && (
        <div className="mt-6 p-4 border rounded-md">
          <Label htmlFor="customType" className="mb-2 block">What best describes your needs?</Label>
          <Input 
            id="customType"
            value={customType}
            onChange={(e) => onCustomTypeChange(e.target.value)}
            placeholder="Describe your specific needs..."
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

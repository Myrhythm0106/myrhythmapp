
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Heart, Users, List, Settings } from "lucide-react";

export type UserType = 
  | "brain-health" 
  | "emotional-wellness" 
  | "family-professional" 
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
          className={`p-6 cursor-pointer hover:border-annabel-500 transition-all ${selectedType === "brain-health" ? "border-2 border-annabel-500" : ""}`}
          onClick={() => handleSelectType("brain-health")}
        >
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-8 w-8 text-annabel-600 shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Brain Health Recovery</h3>
              <p className="text-muted-foreground text-sm">For those recovering from brain injury or conditions, focusing on mental rehabilitation and tracking progress.</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer hover:border-annabel-500 transition-all ${selectedType === "emotional-wellness" ? "border-2 border-annabel-500" : ""}`}
          onClick={() => handleSelectType("emotional-wellness")}
        >
          <div className="flex items-start gap-4">
            <Heart className="h-8 w-8 text-annabel-600 shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Emotional Wellness</h3>
              <p className="text-muted-foreground text-sm">For those seeking balance in mood and emotions, with tools for mindfulness and emotional regulation.</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer hover:border-annabel-500 transition-all ${selectedType === "family-professional" ? "border-2 border-annabel-500" : ""}`}
          onClick={() => handleSelectType("family-professional")}
        >
          <div className="flex items-start gap-4">
            <Users className="h-8 w-8 text-annabel-600 shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Family/Professional Support</h3>
              <p className="text-muted-foreground text-sm">For family members or healthcare professionals seeking to support a loved one or client with their brain health journey.</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer hover:border-annabel-500 transition-all ${selectedType === "productivity" ? "border-2 border-annabel-500" : ""}`}
          onClick={() => handleSelectType("productivity")}
        >
          <div className="flex items-start gap-4">
            <List className="h-8 w-8 text-annabel-600 shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Productivity Champion</h3>
              <p className="text-muted-foreground text-sm">For those seeking to maximize efficiency, complete tasks promptly, and achieve more in less time.</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer hover:border-annabel-500 transition-all ${selectedType === "organization" ? "border-2 border-annabel-500" : ""}`}
          onClick={() => handleSelectType("organization")}
        >
          <div className="flex items-start gap-4">
            <Settings className="h-8 w-8 text-annabel-600 shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Organization Expert</h3>
              <p className="text-muted-foreground text-sm">For those wanting structured routines, methodical planning, and a comprehensive approach to life management.</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer hover:border-annabel-500 transition-all ${selectedType === "custom" ? "border-2 border-annabel-500" : ""}`}
          onClick={() => handleSelectType("custom")}
        >
          <div className="flex items-start gap-4">
            <Settings className="h-8 w-8 text-annabel-600 shrink-0" />
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
            className="w-full focus:ring-annabel-500 focus:border-annabel-500"
          />
        </div>
      )}
    </div>
  );
};

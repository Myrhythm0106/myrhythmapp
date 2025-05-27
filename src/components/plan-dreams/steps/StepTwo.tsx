
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Target, Trash2 } from "lucide-react";

interface StepTwoProps {
  bigDream: string;
  onComplete: (smallerParts: string[]) => void;
  initialParts?: string[];
}

export function StepTwo({ bigDream, onComplete, initialParts = [] }: StepTwoProps) {
  const [smallerParts, setSmallerParts] = useState<string[]>(initialParts.length > 0 ? initialParts : [""]);

  const addSmallerPart = () => {
    setSmallerParts([...smallerParts, ""]);
  };

  const updateSmallerPart = (index: number, value: string) => {
    const updated = [...smallerParts];
    updated[index] = value;
    setSmallerParts(updated);
  };

  const removeSmallerPart = (index: number) => {
    if (smallerParts.length > 1) {
      setSmallerParts(smallerParts.filter((_, i) => i !== index));
    }
  };

  const handleNext = () => {
    const validParts = smallerParts.filter(part => part.trim());
    if (validParts.length > 0) {
      onComplete(validParts);
    }
  };

  const hasValidParts = smallerParts.some(part => part.trim());

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
          <Target className="h-8 w-8 text-white" />
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800">My Big Dream:</h3>
          <p className="text-xl text-purple-900 mt-1">{bigDream}</p>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800">Step by Step Actions</h2>
        <p className="text-gray-600 text-lg">
          What are the small steps you need to take for your goal?
        </p>
      </div>
      
      <div className="space-y-4">
        {smallerParts.map((part, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div className="flex-1">
              <Input
                value={part}
                onChange={(e) => updateSmallerPart(index, e.target.value)}
                placeholder="I'll do this part by..."
                className="text-lg p-4 border-2 border-green-200 focus:border-green-400"
              />
            </div>
            {smallerParts.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeSmallerPart(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        <Button
          onClick={addSmallerPart}
          variant="outline"
          className="w-full border-2 border-dashed border-green-300 text-green-600 hover:bg-green-50 p-4"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add a Smaller Part
        </Button>
        
        <div className="text-sm text-gray-500 space-y-1 text-center">
          <p>Examples for "walk to the mailbox":</p>
          <p>"walking to the front door"</p>
          <p>"walking to the driveway"</p>
          <p>"walking to the mailbox"</p>
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          onClick={handleNext}
          disabled={!hasValidParts}
          size="lg"
          className="text-lg px-8 py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          Next: Plan My Daily Do
        </Button>
      </div>
    </div>
  );
}

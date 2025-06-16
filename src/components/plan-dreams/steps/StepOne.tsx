
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface StepOneProps {
  onComplete: (bigDream: string) => void;
  initialValue?: string;
}

export function StepOne({ onComplete, initialValue = "" }: StepOneProps) {
  const [bigDream, setBigDream] = useState(initialValue);

  const handleNext = () => {
    if (bigDream.trim()) {
      onComplete(bigDream.trim());
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800">What Are You Working Toward?</h2>
        <p className="text-gray-600 text-lg">
          Think about ONE main thing you'd like to achieve - something that matters to you
        </p>
      </div>
      
      <div className="space-y-4">
        <Textarea
          value={bigDream}
          onChange={(e) => setBigDream(e.target.value)}
          placeholder="I want to..."
          className="text-xl p-6 min-h-[120px] text-center border-2 border-purple-200 focus:border-purple-400"
          autoFocus
        />
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>Ideas to get you started:</p>
          <p>"walk to the mailbox by myself"</p>
          <p>"read a whole book"</p>
          <p>"cook a meal for my family"</p>
        </div>
      </div>
      
      <Button 
        onClick={handleNext}
        disabled={!bigDream.trim()}
        size="lg"
        className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
      >
        Let's Break This Down Together
      </Button>
    </div>
  );
}

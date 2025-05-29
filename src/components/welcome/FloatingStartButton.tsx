
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FloatingStartButton() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/profile?from=onboarding");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={handleGetStarted}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-lg rounded-full"
      >
        Start using MyRhythm
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

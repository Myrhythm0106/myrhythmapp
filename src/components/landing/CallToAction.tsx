
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CallToActionProps {
  onGetStarted: () => void;
}

export function CallToAction({ onGetStarted }: CallToActionProps) {
  const navigate = useNavigate();
  
  const handleRegister = () => {
    console.log("CallToAction: Register Here button clicked - PRODUCTION VERSION");
    console.log("CallToAction: About to navigate to /onboarding");
    console.log("CallToAction: Current location:", window.location.href);
    
    try {
      navigate("/onboarding");
      console.log("CallToAction: navigate() called successfully");
    } catch (error) {
      console.error("CallToAction: Navigation error:", error);
    }
  };
  
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Discover Your LEAP?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Start your personal journey through <strong>Your LEAP, Your Rhythm, Your Momentum</strong> - where memory wellness becomes the foundation for your entire life transformation.
        </p>
        
        {/* Enhanced CTA with updated framework messaging */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="text-lg gap-2 px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
            onClick={handleRegister}
          >
            <UserPlus className="h-5 w-5" />
            Register Here
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <div className="text-sm text-muted-foreground">
            ✨ 7-Day Free Trial • Your Personal Journey Begins
          </div>
        </div>

        {/* Framework emphasis */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 max-w-3xl mx-auto">
          <p className="text-base text-gray-700">
            <strong className="text-primary">The MyRhythm Framework:</strong> An evidence-based 8-step system that guides you through 
            <span className="text-primary font-semibold"> Your LEAP, Your Rhythm, Your Momentum</span> journey - 
            transforming lived experience into unstoppable forward progress.
          </p>
        </div>

        {/* Mobile-specific encouragement */}
        <div className="mt-6 sm:hidden">
          <p className="text-xs text-primary font-medium">
            Join thousands building their personal momentum
          </p>
        </div>
      </div>
    </section>
  );
}

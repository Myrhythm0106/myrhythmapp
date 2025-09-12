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
    navigate("/mvp-payment");
  };
  
  return (
    <section className="py-20 bg-gradient-to-b from-purple-50/40 via-blue-50/30 to-teal-50/40">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">Ready to Discover Your MYRHYTHM?</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 font-medium">
          Start your personal journey through <strong className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Your LEAP, Your Rhythm, Your Momentum</strong> - where memory wellness becomes the foundation for your entire life transformation.
        </p>
        
        {/* Enhanced CTA with updated framework messaging */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="text-lg gap-2 px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 hover:scale-105"
            onClick={handleRegister}
          >
            <UserPlus className="h-5 w-5" />
            Start Your MYRHYTHM Journey
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <div className="text-sm text-gray-600 font-medium">
            ✨ 7-Day Free Trial • Transform Your Life Today
          </div>
        </div>

        {/* Framework emphasis */}
        <div className="mt-8 bg-gradient-to-br from-white via-purple-50/50 to-blue-50/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-200/50 max-w-3xl mx-auto shadow-lg">
          <p className="text-base text-gray-700 font-medium">
            <strong className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">The MYRHYTHM Framework:</strong> An empowering 8-step system that guides you through 
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold"> Your LEAP, Your Rhythm, Your Momentum</span> journey - 
            transforming your experience into unstoppable forward progress and life transformation.
          </p>
        </div>

        {/* Mobile-specific encouragement */}
        <div className="mt-6 sm:hidden">
          <p className="text-xs text-purple-600 font-semibold">
            Join thousands building their unstoppable momentum
          </p>
        </div>
      </div>
    </section>
  );
}
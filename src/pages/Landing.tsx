
import React from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  const navigate = useNavigate();
  
  const handleSelectPlan = (plan: string) => {
    navigate(`/onboarding?plan=${plan}&step=3`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/60 to-background">
      <ScrollArea className="h-screen">
        <HeroSection />
        <FeaturesSection />
        <PricingSection onSelectPlan={handleSelectPlan} />
        <TestimonialsSection />
        <Footer />
      </ScrollArea>
    </div>
  );
};

export default Landing;

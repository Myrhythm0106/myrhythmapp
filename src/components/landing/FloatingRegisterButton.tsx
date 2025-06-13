
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function FloatingRegisterButton() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Only show on mobile devices
  if (!isMobile) return null;

  const handleRegister = () => {
    navigate("/onboarding");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <Button 
        onClick={handleRegister}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-white shadow-2xl hover:shadow-xl transition-all duration-300 px-6 py-4 rounded-full text-base font-semibold flex items-center gap-2 hover:scale-105"
      >
        <UserPlus className="h-5 w-5" />
        Register Free
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

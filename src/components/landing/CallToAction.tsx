
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuickRegisterModal } from "./QuickRegisterModal";

interface CallToActionProps {
  onGetStarted: () => void;
}

export function CallToAction({ onGetStarted }: CallToActionProps) {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
  
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Flow?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Start your journey towards a more organized, focused, and fulfilling life.
        </p>
        
        {/* Enhanced CTA with registration prominence */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="text-lg gap-2 px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
            onClick={() => setShowRegisterModal(true)}
          >
            <UserPlus className="h-5 w-5" />
            Register Here
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <div className="text-sm text-muted-foreground">
            ✨ Free Trial • Start immediately
          </div>
        </div>

        {/* Mobile-specific encouragement */}
        <div className="mt-6 sm:hidden">
          <p className="text-xs text-primary font-medium">
            Join thousands who've already started their journey
          </p>
        </div>
      </div>

      <QuickRegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </section>
  );
}

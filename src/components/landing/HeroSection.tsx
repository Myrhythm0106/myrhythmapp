
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, UserPlus, Star } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { QuickRegisterModal } from "./QuickRegisterModal";

export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
  const navigate = useNavigate();

  // Function to scroll to the MyRhythm Framework section
  const scrollToFramework = () => {
    const frameworkSection = document.getElementById('myrhythm-framework');
    if (frameworkSection) {
      frameworkSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 py-24 md:py-32">
      {/* Login button at top right */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10" onClick={() => setShowLoginModal(true)}>
          <LogIn className="h-4 w-4" />
          Login
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Brain className="h-12 w-12 md:h-16 md:w-16 text-primary" />
          <h1 className="text-4xl font-bold text-foreground md:text-7xl">
            MyRhythm
          </h1>
        </div>
        
        <div className="space-y-6 mb-10">
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-annabel-600 md:text-2xl font-medium">
            Your trusted Memory Partner that empowers you to LEAP forward
          </p>
          
          <p className="text-lg max-w-2xl mx-auto leading-relaxed text-muted-foreground">
            Strengthen your memory, reclaim your rhythm, and build the life you want—one mindful step at a time.
          </p>
          
          {/* Memory Partner highlight */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-primary/20 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">Memory Partner Promise</span>
            </div>
            <p className="text-sm text-gray-700">
              Experience real memory improvement in just 7 days with our personalized approach to cognitive wellness and life management.
            </p>
          </div>
        </div>
        
        {/* Simplified CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 flex items-center gap-2" onClick={() => setShowRegisterModal(true)}>
            <UserPlus className="h-5 w-5" />
            Start Your Memory Journey
          </Button>
          
          <Button size="lg" variant="outline" className="text-lg" onClick={scrollToFramework}>
            Learn About Your Memory Partner
          </Button>
        </div>
      </div>

      {/* Modals */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <QuickRegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </section>
  );
}

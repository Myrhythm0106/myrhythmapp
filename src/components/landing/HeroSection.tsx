import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const navigate = useNavigate();

  // Function to scroll to the Discover MyRhythm section
  const scrollToDiscover = () => {
    const discoverSection = document.getElementById('discover-myrhythm');
    if (discoverSection) {
      discoverSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 py-24 md:py-32">
      {/* Login button at top right */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10" onClick={() => setShowLoginModal(true)}>
          <LogIn className="h-4 w-4" />
          Login
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-12 w-12 md:h-16 md:w-16 text-primary" />
          <h1 className="text-4xl font-bold text-foreground md:text-7xl">
            MyRhythm
          </h1>
        </div>
        
        <div className="space-y-6 mb-10">
          <p className="text-lg max-w-2xl mx-auto leading-relaxed text-annabel-600 md:text-lg">
            From overwhelm or memory challenges to daily wins and peace of mind. 
            Be empowered as your confidence grows, momentum builds, and structure becomes your strength. 
            You never walk alone, with MyRhythm by your side.
          </p>
          
          {/* Subtle expansion mention */}
          <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-primary/10 max-w-xl mx-auto">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Built for brain injury recovery</span> — the same framework that helps rebuild rhythm also supports cognitive optimization, caregiving, and wellness journeys.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate("/onboarding")}>Start Your Journey</Button>
          <Button size="lg" variant="outline" className="text-lg" onClick={() => navigate("/founders-story")}>
            Our Story
          </Button>
          <Button size="lg" variant="outline" className="text-lg" onClick={scrollToDiscover}>
            More About MyRhythm
          </Button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </section>;
}
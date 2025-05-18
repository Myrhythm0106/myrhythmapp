import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const navigate = useNavigate();
  return <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 py-24 md:py-32">
      {/* Login button at top right */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10" onClick={() => setShowLoginModal(true)}>
          <LogIn className="h-4 w-4" />
          Login
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Your Rhythm, Your Life: A Gentle Guide to Living Life Well
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">Navigating life after a brain injury or any condition impacting your memory is a unique journey, where finding your own way forward at your own pace is essential. We believe in empowering you with simple, actionable steps. These help you build confidence and create a life that truly feels right for you..</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate("/onboarding")}>
            Start Your Journey
          </Button>
          <Button size="lg" variant="outline" className="text-lg" onClick={() => navigate("/founders-story")}>
            Learn Our Story
          </Button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </section>;
}
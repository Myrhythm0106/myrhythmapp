
import React from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import { PreviewBanner } from "./preview3/PreviewBanner";
import { NavigationHeader } from "./preview3/NavigationHeader";
import { BackgroundEffects } from "./preview3/BackgroundEffects";
import { HeroContent } from "./preview3/HeroContent";

export function Preview3HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  console.log('Preview3HeroSection: Rendering component');

  return (
    <>
      <PreviewBanner />
      <NavigationHeader onShowLoginModal={() => setShowLoginModal(true)} />

      {/* Hero Section */}
      <section id="hero-section" className="relative overflow-hidden min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <BackgroundEffects />
        <HeroContent />
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </section>
    </>
  );
}

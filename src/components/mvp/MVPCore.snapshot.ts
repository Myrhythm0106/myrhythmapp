// DO NOT MODIFY: /mvp baseline reference snapshot
// This file captures the expected baseline markers for MVPCore.tsx

export const MVP_BASELINE_MARKERS = {
  // Hero section
  heroHeadline: "EMPOWER YOUR BRAIN.",
  heroSubheadline: "RECLAIM YOUR POWER.",
  ctaText: "Start your journey",
  ctaRoute: "/mvp/assessment",
  
  // Core solution cards
  solutionCards: [
    {
      title: "Capture - Your Memory Bridge",
      description: "Never lose precious moments. Intelligent capture system for conversations, appointments, and memories.",
      cta: "Explore Capture"
    },
    {
      title: "Commit - Your MyRhythm Calendar Organization", 
      description: "Transform overwhelm into organized action. Adapts to your energy and cognitive patterns.",
      cta: "Explore Calendar"
    },
    {
      title: "Celebrate - Memory Bank & Gratitude (Confidence Builder)",
      description: "Build unshakeable confidence. Track progress, store wins, cultivate gratitude.",
      cta: "Explore Gratitude"
    }
  ],
  
  // Page structure
  hasAuthModal: false,
  hasLoginButton: false,
  hasSupportCircleSection: false,
  isPublicRoute: true
};

// Dev-only baseline check
if (process.env.NODE_ENV !== 'production') {
  console.log('📸 MVPCore baseline snapshot loaded');
}

import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, ArrowRight, ChevronDown, Home, Eye } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";

export function Preview3HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const navigate = useNavigate();

  const handleStartJourney = () => {
    console.log("Preview3HeroSection: START YOUR CLEARER JOURNEY button clicked");
    try {
      navigate("/onboarding");
    } catch (error) {
      console.error("Preview3HeroSection: Navigation error:", error);
    }
  };

  const handleGoToLive = () => {
    navigate("/");
  };

  const handleGoToPreview1 = () => {
    navigate("/preview-landing");
  };

  const handleGoToPreview2 = () => {
    navigate("/preview-2");
  };

  return (
    <>
      {/* PREVIEW 3 BANNER */}
      <div className="bg-emerald-100 border-b-4 border-emerald-400 p-2 text-center">
        <p className="text-emerald-800 font-semibold">🌱 PREVIEW 3 - Brain-Health Focus: LEAP. REMEMBER. THRIVE.</p>
      </div>

      {/* Navigation Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">MyRhythm</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features-section" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Features</a>
              <a href="#pricing-section" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Pricing</a>
              <a href="#testimonials-section" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Testimonials</a>
              
              {/* Preview Navigation */}
              <div className="flex items-center gap-2 ml-4 border-l border-gray-200 pl-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2 hover:bg-gray-100" 
                  onClick={handleGoToLive}
                >
                  <Home className="h-4 w-4" />
                  Live
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2 hover:bg-blue-50" 
                  onClick={handleGoToPreview1}
                >
                  <Eye className="h-4 w-4" />
                  P1
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2 hover:bg-purple-50" 
                  onClick={handleGoToPreview2}
                >
                  <Brain className="h-4 w-4" />
                  P2
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 hover:bg-emerald-50" 
                onClick={() => setShowLoginModal(true)}
              >
                <LogIn className="h-4 w-4" />
                Log In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="relative overflow-hidden min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        
        {/* Background Visual Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Memory1st Visual Effects - Interconnected glowing nodes */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-teal-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-emerald-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-teal-300 rounded-full animate-pulse opacity-40" style={{animationDelay: '1.5s'}}></div>
          
          {/* Connecting memory trails */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="memoryTrail" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#10B981', stopOpacity:0}} />
                <stop offset="50%" style={{stopColor:'#14B8A6', stopOpacity:0.4}} />
                <stop offset="100%" style={{stopColor:'#10B981', stopOpacity:0}} />
              </linearGradient>
            </defs>
            <path d="M 25% 25% Q 50% 15% 75% 35%" stroke="url(#memoryTrail)" strokeWidth="2" fill="none" className="animate-pulse" />
            <path d="M 35% 65% Q 55% 45% 80% 70%" stroke="url(#memoryTrail)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '0.7s'}} />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 max-w-6xl min-h-screen flex items-center">
          <div className="text-center w-full space-y-8">
            
            {/* Main Headlines */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl font-bold text-gray-900 leading-tight">
                <span className="text-emerald-600">LEAP.</span>
                <br />
                <span className="text-teal-600">REMEMBER.</span>
                <br />
                <span className="text-gray-900">THRIVE.</span>
              </h1>
              
              <h2 className="text-3xl lg:text-4xl font-semibold text-gray-700 max-w-4xl mx-auto">
                Your Rhythm for Unforgettable Growth.
              </h2>
            </div>

            {/* Body Copy */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Tired of great ideas fading? Frustrated by forgetting lessons learned? MyRhythm helps you take massive strides in life and productivity, ensuring every vital lesson and hard-won triumph is <strong className="text-emerald-600">remembered</strong>, not lost.
            </p>

            {/* Primary CTA */}
            <div className="space-y-4 pt-6">
              <Button 
                size="lg" 
                className="text-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 px-12 py-8 rounded-full group relative overflow-hidden" 
                onClick={handleStartJourney}
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full animate-pulse"></div>
                <div className="relative flex items-center gap-3">
                  <span className="text-center leading-tight font-semibold">
                    START YOUR CLEARER JOURNEY
                  </span>
                  <ArrowRight className="h-6 w-6 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
              
              <p className="text-sm text-gray-500 text-center">
                No credit card required. Cancel anytime.
              </p>
            </div>

            {/* Hero Visual Container */}
            <div className="relative max-w-4xl mx-auto mt-16">
              {/* Main Hero Visual */}
              <div 
                className="w-full h-64 lg:h-80 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Overlay for text visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-teal-600/30 rounded-3xl"></div>
                
                {/* Memory trail effects */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-20 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald-200 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute top-1/2 left-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-teal-200 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
                
                {/* Central content */}
                <div className="relative text-center text-white z-10">
                  <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Brain className="h-10 w-10 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Every Step Remembered</h3>
                  <p className="text-lg opacity-90">Growth that truly sticks</p>
                </div>
              </div>
              
              {/* Floating memory nodes around the visual */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-500 rounded-full opacity-70 animate-pulse flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-teal-500 rounded-full opacity-60 animate-pulse flex items-center justify-center" style={{animationDelay: '1s'}}>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-1/2 -right-5 w-6 h-6 bg-emerald-400 rounded-full opacity-80 animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <ChevronDown className="h-8 w-8 text-gray-600/70" />
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </section>
    </>
  );
}

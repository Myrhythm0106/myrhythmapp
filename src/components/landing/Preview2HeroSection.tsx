
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, UserPlus, Star, ChevronDown, Zap, RotateCcw, TrendingUp } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Preview2HeroSection() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleStartTrial = () => {
    console.log("Preview2HeroSection: LEAP & Remember button clicked");
    try {
      navigate("/onboarding");
    } catch (error) {
      console.error("Preview2HeroSection: Navigation error:", error);
    }
  };

  return (
    <TooltipProvider>
      {/* PREVIEW 2 BANNER */}
      <div className="bg-purple-100 border-b-4 border-purple-400 p-2 text-center">
        <p className="text-purple-800 font-semibold">🧠 PREVIEW 2 - Memory1st Focus: LEAP Forward & Remember Every Step</p>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">MyRhythm</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary font-medium transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary font-medium transition-colors">Testimonials</a>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 hover:bg-primary/10" 
                onClick={() => setShowLoginModal(true)}
              >
                <LogIn className="h-4 w-4" />
                Log In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Memory1st Visual Effects - Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Glowing interconnected nodes */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-50" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-indigo-400 rounded-full animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-70" style={{animationDelay: '1.5s'}}></div>
          
          {/* Connecting lines/trails */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:0}} />
                <stop offset="50%" style={{stopColor:'#6366F1', stopOpacity:0.3}} />
                <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:0}} />
              </linearGradient>
            </defs>
            <path d="M 25% 25% Q 50% 10% 75% 35%" stroke="url(#trail)" strokeWidth="2" fill="none" className="animate-pulse" />
            <path d="M 33% 66% Q 60% 50% 80% 75%" stroke="url(#trail)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '0.5s'}} />
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Side - Main Content */}
            <div className="space-y-8">
              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  <span className="text-primary">LEAP</span> Forward.
                  <br />
                  <span className="text-indigo-600">Remember</span> Every Step.
                </h1>
                
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-700">
                  MyRhythm for Unforgettable Growth.
                </h2>
              </div>

              {/* Body Copy */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Don't just progress—<strong className="text-indigo-600">ingrain it</strong>. MyRhythm helps you take massive strides in life and productivity, ensuring every lesson and triumph is <strong className="text-purple-600">remembered</strong>, not lost.
              </p>

              {/* Primary CTA */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 px-10 py-8 rounded-full group relative overflow-hidden" 
                  onClick={handleStartTrial}
                >
                  {/* Memory1st glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
                  <div className="relative flex items-center gap-3">
                    <Zap className="h-6 w-6 flex-shrink-0 group-hover:animate-pulse" />
                    <span className="text-center leading-tight">
                      LEAP & Remember – Start Your Free Trial!
                    </span>
                  </div>
                </Button>
                
                <p className="text-sm text-gray-500 text-center max-w-md mx-auto lg:mx-0">
                  No credit card required. Cancel anytime.
                </p>
              </div>

              {/* Trust indicators with Memory1st theme */}
              <div className="flex items-center gap-6 text-sm text-gray-600 pt-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-blue-500" />
                  <span>Remember Every Lesson</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span>Build Lasting Progress</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-indigo-500" />
                  <span>Ingrain Every Victory</span>
                </div>
              </div>
            </div>

            {/* Right Side - Hero Visual */}
            <div className="relative">
              {/* Main Hero Image Container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
                
                {/* Memory1st Visual Metaphor */}
                <div className="relative">
                  {/* Central leap visual */}
                  <div 
                    className="w-full h-64 lg:h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
                    
                    {/* Memory trail effects */}
                    <div className="absolute inset-0">
                      {/* Shimmer trails */}
                      <div className="absolute top-1/4 left-1/4 w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                      <div className="absolute bottom-1/3 right-1/4 w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-200 to-transparent animate-pulse" style={{animationDelay: '0.7s'}}></div>
                      <div className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent animate-pulse" style={{animationDelay: '1.4s'}}></div>
                    </div>
                    
                    {/* Central content */}
                    <div className="relative text-center text-white z-10">
                      <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Brain className="h-8 w-8 text-white animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Every Step Remembered</h3>
                      <p className="text-sm opacity-90">Progress that sticks forever</p>
                    </div>
                  </div>
                  
                  {/* Floating memory nodes */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full opacity-70 animate-pulse flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-500 rounded-full opacity-60 animate-pulse flex items-center justify-center" style={{animationDelay: '1s'}}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-1/2 -right-4 w-4 h-4 bg-indigo-400 rounded-full opacity-80 animate-pulse" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
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
    </TooltipProvider>
  );
}

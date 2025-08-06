import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Star, TrendingUp, Quote, LogIn, Lightbulb, Calendar, Archive, ChevronDown } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
export default function OptimizedLanding() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const handleGetStarted = () => {
    console.log('🚀 OptimizedLanding: Get started clicked, navigating to onboarding');
    navigate('/onboarding');
  };
  const testimonials = [{
    quote: "I went from forgetting my kids' names to helping them with homework. MyRhythm gave me my identity back.",
    author: "Maria C.",
    condition: "Stroke Survivor, 2 years recovery",
    highlight: "Identity Restored"
  }, {
    quote: "My husband and I were falling apart. Now we're stronger than ever. MyRhythm saved our marriage and our family.",
    author: "David & Jennifer K.",
    condition: "TBI Recovery Journey",
    highlight: "Marriage Saved"
  }, {
    quote: "From dependent to independent in 6 months. I'm driving again, working again, LIVING again.",
    author: "Marcus T.",
    condition: "Concussion Recovery",
    highlight: "Independence Regained"
  }];
  return <div className="min-h-screen">
      {/* HERO SECTION - Dark, Bold, Dramatic */}
      <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
        {/* Bold, dramatic background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-transparent to-teal-600/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.3),transparent)] opacity-80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.3),transparent)] opacity-80"></div>
        </div>

        {/* Dynamic floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400/40 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-24 h-24 bg-teal-400/50 rounded-full blur-xl animate-pulse" style={{
          animationDelay: '2s'
        }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-emerald-300/45 rounded-full blur-xl animate-pulse" style={{
          animationDelay: '4s'
        }}></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-teal-300/35 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '6s'
        }}></div>
        </div>

        {/* Top navigation */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 rounded-full px-6 py-2 font-medium" onClick={() => setShowLoginModal(true)}>
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-7xl min-h-screen flex items-center">
          <div className="text-center w-full space-y-16 pt-16">
            
            {/* Powerful opening */}
            <div className="space-y-8">
              <div className="inline-block px-8 py-3 bg-emerald-400/20 rounded-full border border-emerald-400/40 backdrop-blur-sm mb-6">
                <span className="text-emerald-200 font-bold text-lg">🔥 By Survivors, For Survivors</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tight">
                No One Walks
                <br />
                <span className="text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
                  Alone
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-emerald-100 max-w-5xl mx-auto leading-relaxed font-light">
                The brain recovery platform that turns your biggest challenges into your greatest victories
              </p>
            </div>

            {/* Survivor Success Stats - BOLD Impact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
              <div className="bg-white/15 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:scale-105 transition-transform">
                <div className="text-6xl font-black text-emerald-400 mb-4">94%</div>
                <div className="text-2xl text-white font-bold mb-2">Feel More Confident</div>
                <div className="text-emerald-200 text-lg">Within 30 days</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:scale-105 transition-transform">
                <div className="text-6xl font-black text-teal-400 mb-4">2,847</div>
                <div className="text-2xl text-white font-bold mb-2">Survivors Thriving</div>
                <div className="text-teal-200 text-lg">And counting daily</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:scale-105 transition-transform">
                <div className="text-6xl font-black text-emerald-400 mb-4">89%</div>
                <div className="text-2xl text-white font-bold mb-2">Families Reconnected</div>
                <div className="text-emerald-200 text-lg">Stronger than before</div>
              </div>
            </div>

            {/* Perfect Match System - Problem → Solution */}
            <div className="space-y-12 py-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-white mb-4">Your Struggles → Our Solutions</h2>
                <p className="text-xl text-emerald-200">The perfect match for every challenge you face</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Problem → Solution Cards */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-red-300">
                      <div className="text-2xl font-bold mb-2">😔 I Can't Remember</div>
                      <p className="text-lg text-red-200">Names, appointments, medications</p>
                    </div>
                    <ArrowRight className="h-8 w-8 text-white/50 group-hover:text-emerald-400 transition-colors" />
                    <div className="text-emerald-300">
                      <div className="text-2xl font-bold mb-2">✨ Memory Bridge</div>
                      <p className="text-lg text-emerald-200">Smart prompts that rebuild connections</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-red-300">
                      <div className="text-2xl font-bold mb-2">😞 I Feel Lost</div>
                      <p className="text-lg text-red-200">No progress, no hope, no direction</p>
                    </div>
                    <ArrowRight className="h-8 w-8 text-white/50 group-hover:text-teal-400 transition-colors" />
                    <div className="text-teal-300">
                      <div className="text-2xl font-bold mb-2">🎯 Empowerment Hub</div>
                      <p className="text-lg text-teal-200">Track wins, celebrate every victory</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-red-300">
                      <div className="text-2xl font-bold mb-2">😵 Days Feel Chaos</div>
                      <p className="text-lg text-red-200">Overwhelmed, scattered, stressed</p>
                    </div>
                    <ArrowRight className="h-8 w-8 text-white/50 group-hover:text-emerald-400 transition-colors" />
                    <div className="text-emerald-300">
                      <div className="text-2xl font-bold mb-2">📅 Cognitive Calendar</div>
                      <p className="text-lg text-emerald-200">Visual clarity for complex days</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-red-300">
                      <div className="text-2xl font-bold mb-2">💔 Losing Myself</div>
                      <p className="text-lg text-red-200">Forgetting who I used to be</p>
                    </div>
                    <ArrowRight className="h-8 w-8 text-white/50 group-hover:text-teal-400 transition-colors" />
                    <div className="text-teal-300">
                      <div className="text-2xl font-bold mb-2">🏆 Memory Bank</div>
                      <p className="text-lg text-teal-200">Preserve your precious moments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgent CTA with Scarcity */}
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="inline-block px-6 py-3 bg-orange-500/30 rounded-full border border-orange-400/50">
                  <span className="text-orange-200 font-bold text-lg">🚀 Limited Beta Access - Only 127 spots left</span>
                </div>
                <div className="flex items-center gap-2 text-orange-200">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Filling Fast!</span>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                <Button size="lg" className="text-2xl px-16 py-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 font-black shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20" onClick={handleGetStarted}>
                  The Empowerment Revolution
                  <Badge className="ml-4 bg-white/30 text-white border-white/50 text-lg px-3 py-1">FREE ACCESS</Badge>
                </Button>
              </div>
              
              <div className="text-lg text-emerald-200 max-w-3xl mx-auto font-medium">
                Join 2,847 survivors who've reclaimed their confidence. No credit card required. Your journey starts now.
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="h-8 w-8 text-emerald-400" />
        </div>

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </section>

      {/* TESTIMONIALS SECTION - High Impact */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 mb-6">
              <span className="text-emerald-700 font-bold">💪 REAL STORIES, REAL VICTORIES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              They Did It.
              <br />
              <span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                So Can You.
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              Real survivors. Real transformations. Real hope.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => <div key={index} className="bg-white rounded-3xl p-8 shadow-2xl border border-emerald-100 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                {/* Highlight badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm">
                  {testimonial.highlight}
                </div>

                {/* Before/After Visual */}
                <div className="mb-6 pt-8">
                  <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-red-50 to-emerald-50 rounded-2xl">
                    <div className="text-center">
                      <div className="text-red-500 text-2xl mb-2">😔</div>
                      <div className="text-sm font-bold text-red-700">BEFORE</div>
                      <div className="text-xs text-red-600">Struggling</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className="text-center">
                      <div className="text-emerald-500 text-2xl mb-2">🌟</div>
                      <div className="text-sm font-bold text-emerald-700">AFTER</div>
                      <div className="text-xs text-emerald-600">Thriving</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <Quote className="h-12 w-12 text-emerald-500/30 mb-4" />
                </div>

                <p className="text-xl text-gray-800 font-medium italic leading-relaxed mb-6 group-hover:text-emerald-700 transition-colors">
                  "{testimonial.quote}"
                </p>

                <div className="border-t border-emerald-100 pt-6">
                  <p className="font-bold text-emerald-700 text-lg">{testimonial.author}</p>
                  <p className="text-gray-600 font-medium">{testimonial.condition}</p>
                </div>

                {/* Hover effect */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>)}
          </div>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <Heart className="h-16 w-16 mx-auto mb-6 text-white/80" />
              <h3 className="text-4xl font-black mb-4">Your Victory Story Starts Now</h3>
              <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
                Join 2,847 survivors who've transformed their lives. Your breakthrough is waiting.
              </p>
              <Button size="lg" className="text-xl px-12 py-6 bg-white text-emerald-600 hover:bg-emerald-50 font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all" onClick={handleGetStarted}>
                Start My Empowerment Journey
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <div className="text-emerald-200 font-medium mt-4">
                Free access • No credit card • Join in 60 seconds
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
}
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Shield, Users, Calendar, Heart, Lightbulb, Target, Zap } from "lucide-react";
import { BeforeAfterBrainStates } from "@/components/landing/preview3/BeforeAfterBrainStates";
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              MyRhythm
            </h1>
          </div>
          <Button onClick={() => navigate("/auth")} variant="outline" className="border-purple-200 hover:bg-purple-50">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">Rewire Your Mind. 
Transform Your Life.</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            MyRhythm bridges consumer cognitive wellness with clinical-grade brain injury support, 
            built by founders with lived experience in cognitive recovery.
          </p>
          <p className="text-base md:text-lg text-gray-500 mb-8 max-w-2xl mx-auto italic">
            "Your brain is neuroplastic - it can change, adapt, and grow stronger. We help you harness that power."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button onClick={() => navigate("/mvp/user-type-selection")} size="lg" className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 hover:from-purple-600 hover:via-blue-600 hover:to-teal-600">
              Start Your Transformation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="border-purple-200 hover:bg-purple-50">
              See The Science
            </Button>
          </div>
        </div>

        {/* Brain Transformation Visual */}
        <BeforeAfterBrainStates />

        {/* Mindset Transformation Section */}
        <div className="py-16 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-purple-100 max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12 px-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              From Scattered to Structured: Your Mindset Revolution
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Experience the profound shift from chaotic thinking patterns to clear, organized mental pathways. 
              Your transformation begins with changing how you think about your own potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-red-700">Fixed Mindset</h3>
              <p className="text-sm text-gray-600">
                "My brain can't change. These struggles define me. I'm stuck with these limitations."
              </p>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-purple-500 transform rotate-0 md:rotate-0" />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Target className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-emerald-700">Growth Mindset</h3>
              <p className="text-sm text-gray-600">
                "My brain is adaptable. Every challenge is growth. I can build new neural pathways."
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Cognitive Wellness Toolkit</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Science-backed tools designed to strengthen your mental clarity, focus, and resilience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Cognitive Restructuring</h3>
              <p className="text-sm text-gray-600">
                Transform negative thought patterns into empowering beliefs through proven techniques.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Mental Clarity Building</h3>
              <p className="text-sm text-gray-600">
                Clear the mental fog and sharpen your focus with structured thinking exercises.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-teal-100">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold mb-2">Support Network</h3>
              <p className="text-sm text-gray-600">
                Connect with caregivers and healthcare providers who understand your journey.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Mindset Reframing</h3>
              <p className="text-sm text-gray-600">
                Shift from limitation thinking to possibility thinking with daily affirmations.
              </p>
            </div>
          </div>
        </div>

        {/* Founder Story Section */}
        <div className="bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-teal-600/10 rounded-lg p-8 mb-16 border border-purple-200/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Built by Someone Who Understands</h2>
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg border border-purple-200/50">
              <p className="text-lg text-gray-700 mb-4 italic">
                "After my brain aneurysm, remembering simple things felt impossible. With my husband's support, 
                we rebuilt a rhythm that gave us back our peace. That rhythm became MyRhythm."
              </p>
              <p className="text-sm font-medium text-purple-700">
                — Bella A., Brain Health Coach, Brain Aneurysm Survivor & Ambassador
              </p>
            </div>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
              Every feature in MyRhythm comes from lived experience. We understand the journey because we've walked it ourselves.
            </p>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-purple-100 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-semibold">Privacy & Security First</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">GDPR Compliant</h3>
              <p className="text-sm text-gray-600 mb-4">
                Full compliance with healthcare data regulations and privacy laws.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Encrypted Storage</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your data is encrypted and stored securely with enterprise-grade protection.
              </p>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <Button variant="link" onClick={() => navigate("/privacy-policy")} className="text-purple-600 p-0">
              Privacy Policy
            </Button>
            <Button variant="link" onClick={() => navigate("/terms")} className="text-purple-600 p-0">
              Terms of Service
            </Button>
          </div>
        </div>
      </main>
    </div>;
};
export default Index;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Shield, Users, Calendar, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60">
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
          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="border-purple-200 hover:bg-purple-50"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            Transform Your Cognitive Wellness Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            MyRhythm bridges consumer cognitive wellness with clinical-grade brain injury support, 
            built by founders with lived experience in cognitive recovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 hover:from-purple-600 hover:via-blue-600 hover:to-teal-600"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-purple-200 hover:bg-purple-50"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Cognitive Training</h3>
            <p className="text-sm text-gray-600">
              Personalized brain training exercises designed for your unique recovery journey.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Daily Planning</h3>
            <p className="text-sm text-gray-600">
              Smart scheduling and reminders to help you stay organized and on track.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-teal-100">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="font-semibold mb-2">Care Team Support</h3>
            <p className="text-sm text-gray-600">
              Connect with family, caregivers, and healthcare providers in one platform.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Wellness Tracking</h3>
            <p className="text-sm text-gray-600">
              Monitor mood, symptoms, and progress with clinical-grade tracking tools.
            </p>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className="mt-16 bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-purple-100 max-w-4xl mx-auto">
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
            <Button
              variant="link"
              onClick={() => navigate("/privacy-policy")}
              className="text-purple-600 p-0"
            >
              Privacy Policy
            </Button>
            <Button
              variant="link"
              onClick={() => navigate("/terms")}
              className="text-purple-600 p-0"
            >
              Terms of Service
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

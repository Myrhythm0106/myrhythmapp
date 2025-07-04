
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, Brain, Home, Eye } from "lucide-react";

interface NavigationHeaderProps {
  onShowLoginModal: () => void;
}

export function NavigationHeader({ onShowLoginModal }: NavigationHeaderProps) {
  const navigate = useNavigate();

  return (
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
                onClick={() => navigate("/landing-original")}
              >
                <Home className="h-4 w-4" />
                Original
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50" 
                onClick={() => navigate("/preview-landing")}
              >
                <Eye className="h-4 w-4" />
                P1
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 hover:bg-purple-50" 
                onClick={() => navigate("/preview-2")}
              >
                <Brain className="h-4 w-4" />
                P2
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 hover:bg-emerald-50" 
              onClick={onShowLoginModal}
            >
              <LogIn className="h-4 w-4" />
              Log In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onShowLoginModal}
            >
              <LogIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

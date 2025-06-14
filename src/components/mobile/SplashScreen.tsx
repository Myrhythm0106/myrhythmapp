
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const SplashScreen = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Animate content in after a short delay
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-beacon-100 to-beacon-200">
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 space-y-10 max-w-md mx-auto">
        {/* Logo and App Name */}
        <div 
          className={`flex flex-col items-center transition-all duration-700 ease-out transform ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-white rounded-full p-4 shadow-md mb-4">
            <ShieldCheck className="h-16 w-16 text-beacon-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
            MyRhythm
          </h1>
        </div>

        {/* Taglines and Description */}
        <div 
          className={`space-y-6 text-center transition-all duration-700 delay-300 ease-out transform ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            Organize Your World. Support Your Recall.
          </h2>
          
          <div className="space-y-4 max-w-sm mx-auto">
            <p className="text-muted-foreground text-lg">
              Empowering you to live O.R.D.E.R.ly.
            </p>
            <ul className="space-y-2 text-sm md:text-base">
              <li className="flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-beacon-600"></span>
                <span>Organize priorities</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-beacon-600"></span>
                <span>build Routines</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-beacon-700"></span>
                <span>strengthen Discipline</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-beacon-700"></span>
                <span>Execute with focus</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-beacon-600"></span>
                <span>Review with intention</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to action button */}
        <div 
          className={`w-full transition-all duration-700 delay-600 ease-out transform ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button 
            onClick={() => navigate("/customization")} 
            className="w-full py-6 text-lg font-medium rounded-xl bg-gradient-to-r from-beacon-600 to-beacon-800 shadow-lg hover:shadow-xl transition-all"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

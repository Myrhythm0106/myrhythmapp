
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PreviewHeroSection } from "@/components/landing/PreviewHeroSection";

const PreviewLanding = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Only redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !loading) {
      console.log('PreviewLanding: Redirecting authenticated user to dashboard');
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  // Don't show loading for unauthenticated users - just show the landing page
  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading MyRhythm Preview 1...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PreviewHeroSection />
    </div>
  );
};

export default PreviewLanding;

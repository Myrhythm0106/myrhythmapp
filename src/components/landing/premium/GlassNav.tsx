import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function GlassNav() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              MyRhythm
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate("/auth")}
              variant="ghost"
              className="text-gray-900 hover:text-brand-emerald-600 transition-colors font-medium"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}


import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RhythmSummaryActionsProps {
  onBack?: () => void;
  onPersonalizeClick: () => void;
}

export function RhythmSummaryActions({ onBack, onPersonalizeClick }: RhythmSummaryActionsProps) {
  const navigate = useNavigate();

  const handleUserGuideClick = () => {
    navigate("/guide");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
      <div className="flex gap-3">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment
          </Button>
        )}
        
        <Button 
          onClick={handleUserGuideClick}
          variant="outline"
          className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <BookOpen className="h-4 w-4" />
          Access User Guide
        </Button>
      </div>
      
      <Button 
        onClick={onPersonalizeClick}
        className="py-6 text-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105"
      >
        Personalise MyRhythm
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}


import React, { useState } from "react";
import { MorningRitualDashboard } from "../MorningRitualDashboard";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function MorningRitualView() {
  const navigate = useNavigate();
  const [morningComplete, setMorningComplete] = useState(false);
  const [dailyIntention, setDailyIntention] = useState('');
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);

  const handleSetDailyIntention = (intention: string) => {
    setDailyIntention(intention);
    toast.success("Daily intention set! 🎯");
    checkMorningRitualComplete(intention, energyLevel);
  };

  const handleEnergyLevelSet = (level: number) => {
    setEnergyLevel(level);
    toast.success(`Energy level recorded: ${level}/5 ⚡`);
    checkMorningRitualComplete(dailyIntention, level);
  };

  const checkMorningRitualComplete = (intention: string, energy: number | null) => {
    if (intention && energy !== null && !morningComplete) {
      setMorningComplete(true);
      toast.success("🌅 Morning ritual complete! Ready to start your day!");
    }
  };

  const proceedToCalendar = () => {
    // Save morning ritual data
    const morningData = {
      date: new Date().toISOString(),
      intention: dailyIntention,
      energyLevel: energyLevel,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`morning_ritual_${new Date().toDateString()}`, JSON.stringify(morningData));
    
    // Navigate to calendar
    navigate('/calendar');
  };

  const handleUpgradeClick = () => {
    toast.success("Upgrade feature coming soon! 🚀");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Start Your Day Right</h1>
        <p className="text-muted-foreground">
          Your personalized morning ritual to set the tone for success
        </p>
      </div>

      <MorningRitualDashboard
        onSetDailyIntention={handleSetDailyIntention}
        onEnergyLevelSet={handleEnergyLevelSet}
        onUpgradeClick={handleUpgradeClick}
      />

      {morningComplete && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200 text-center">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            🎉 Morning Ritual Complete!
          </h3>
          <p className="text-green-700 mb-4">
            You're ready to tackle the day with intention and energy!
          </p>
          <Button 
            onClick={proceedToCalendar}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Calendar className="h-5 w-5 mr-2" />
            View Today's Calendar
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}


import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Battery } from "lucide-react";
import { cn } from "@/lib/utils";

export function EnergyLevelIndicator() {
  const [energyLevel, setEnergyLevel] = useState(70);
  
  // Energy level message based on current value
  const getEnergyMessage = () => {
    if (energyLevel >= 80) return "Your energy is high. Great time for challenging tasks!";
    if (energyLevel >= 60) return "Good energy level. Consider balancing activities.";
    if (energyLevel >= 40) return "Moderate energy. Take breaks between tasks.";
    if (energyLevel >= 20) return "Energy is getting low. Consider a rest period.";
    return "Very low energy. Time for self-care and rest.";
  };

  // Function to determine the background color based on energy level
  const getEnergyColor = () => {
    if (energyLevel >= 80) return "bg-green-500";
    if (energyLevel >= 60) return "bg-green-400";  
    if (energyLevel >= 40) return "bg-yellow-400";
    if (energyLevel >= 20) return "bg-orange-400";
    return "bg-red-500";
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Battery className={cn("h-5 w-5", 
            energyLevel > 60 ? "text-green-500" : 
            energyLevel > 30 ? "text-yellow-500" : 
            "text-red-500")} 
          />
          Energy Level
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${getEnergyColor()}`} 
            style={{ width: `${energyLevel}%` }}
          ></div>
        </div>
        
        <Slider
          value={[energyLevel]}
          min={0}
          max={100}
          step={5}
          onValueChange={(values) => setEnergyLevel(values[0])}
          className="py-2"
        />
        
        <p className="text-sm font-medium mt-1">
          {getEnergyMessage()}
        </p>
        
        {energyLevel < 50 && (
          <p className="text-sm p-2 bg-amber-50 border border-amber-200 rounded-md mt-2">
            Consider rescheduling your upcoming high-intensity tasks
          </p>
        )}
      </CardContent>
    </Card>
  );
}

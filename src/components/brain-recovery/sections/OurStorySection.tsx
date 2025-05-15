
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

export function OurStorySection() {
  const navigate = useNavigate();
  
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">🌱 Our Story, Now Yours Too</h2>
      
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-beacon-100 to-beacon-300 p-6 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full">
              <Brain className="h-16 w-16 text-beacon-600" />
            </div>
          </div>
          
          <CardContent className="md:w-2/3 p-6">
            <p className="mb-4">
              After my injury, our home was filled with sticky notes, alarms, missed moments and tension. 
              My husband became my reminder, planner and alarm. But what we needed wasn't more noise—it was 
              shared rhythm. That's how MyRhythm was born.
            </p>
            
            <p className="text-lg font-medium text-beacon-700 italic">
              "It's not just about remembering. It's about rising."
            </p>
            
            <div className="mt-6">
              <Button 
                onClick={() => navigate("/onboarding")}
                className="bg-beacon-600 hover:bg-beacon-700"
              >
                Join Us Now
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
}

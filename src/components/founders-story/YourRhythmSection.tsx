
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function YourRhythmSection() {
  const navigate = useNavigate();
  
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground">💌 Your Rhythm Begins Here</h2>
      <div className="space-y-4 mt-3 text-foreground">
        <p>
          I didn't create this app to impress anyone.<br />
          I built it because I needed it—and it worked.
        </p>
        <p className="font-medium text-foreground">Now, it's your turn.</p>
        <p className="text-foreground">🎉 Join thousands of others taking back their time, clarity, and confidence with MyRhythm.</p>
        <p className="text-foreground">👇 Tap below to begin. Because waiting for "normal" isn't the answer—taking control is.</p>
        <div className="flex justify-center my-8">
          <Button onClick={() => navigate("/onboarding")} className="text-xl px-8 py-6 h-auto">
            Get MyRhythm Now 🔒
          </Button>
        </div>
      </div>
    </section>
  );
}

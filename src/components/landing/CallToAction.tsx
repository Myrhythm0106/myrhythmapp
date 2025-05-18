
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CallToActionProps {
  onGetStarted: () => void;
}

export function CallToAction({ onGetStarted }: CallToActionProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Flow?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Start your journey towards a more organized, focused, and fulfilling life.
        </p>
        <Button 
          size="lg" 
          className="text-lg gap-2 px-8 py-6 h-auto shadow-md hover:shadow-lg transition-all"
          onClick={onGetStarted}
        >
          <Download className="h-5 w-5" />
          Download Your Free MYRHYTHM Guide
        </Button>
      </div>
    </section>
  );
}

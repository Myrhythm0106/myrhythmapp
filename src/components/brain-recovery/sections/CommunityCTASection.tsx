
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CommunityCTASection() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">👨‍👩‍👧‍👦 Be Part of Our Community</h2>
      
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <p className="text-lg font-medium text-center italic">
              "Your Journey Shared: In Community, No One Walks Alone."
            </p>
            
            <p className="text-lg font-medium">Join our waitlist and be the first to try MyRhythm as a:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="border-2 border-blue-300 bg-white hover:bg-blue-50"
                onClick={() => navigate("/onboarding?type=survivor")}
              >
                ✅ Survivor
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-blue-300 bg-white hover:bg-blue-50"
                onClick={() => navigate("/onboarding?type=family")}
              >
                ✅ My Support
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-blue-300 bg-white hover:bg-blue-50"
                onClick={() => navigate("/onboarding?type=medical")}
              >
                ✅ Medical Professional
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-center sm:text-left text-muted-foreground">
                Let's rebuild your rhythm together
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                onClick={() => navigate("/onboarding")}
              >
                🕊 Start Your Recovery Journey
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">
          © {currentYear} MyRhythm - Empowering brain injury recovery through personalized structure
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <Button variant="link" size="sm" className="text-xs" onClick={() => navigate("/useful-info")}>
            Resources
          </Button>
          <Button variant="link" size="sm" className="text-xs" onClick={() => navigate("/community")}>
            Community
          </Button>
          <Button variant="link" size="sm" className="text-xs" onClick={() => navigate("/useful-info?tab=faq")}>
            FAQ
          </Button>
        </div>
      </div>
    </section>
  );
}

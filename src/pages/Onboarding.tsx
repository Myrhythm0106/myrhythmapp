import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserTypeSelector, UserType } from "@/components/onboarding/UserTypeSelector";
import { toast } from "sonner";
import { Brain } from "lucide-react";
const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const handleContinue = () => {
    if (step === 1) {
      if (!userType) {
        toast.error("Please select a user type to continue");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!name.trim()) {
        toast.error("Please enter your name to continue");
        return;
      }
      // In a real app, we would save this information to a database or local storage
      toast.success("Profile created successfully!");
      navigate("/");
    }
  };
  return <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Brain className="h-10 w-10 text-beacon-600" />
            <h1 className="text-3xl font-bold">MyRhythm</h1>
          </div>
        </div>
        
        <Card className="border-2">
          <CardHeader>
            <CardTitle>
              {step === 1 ? "Welcome! Tell us about yourself" : "Complete your profile"}
            </CardTitle>
            <CardDescription>
              {step === 1 ? "Select the option that best describes your situation" : "Just a few more details to personalize your experience"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? <UserTypeSelector selectedType={userType} onChange={setUserType} /> : <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Your Location (optional)</Label>
                  <Input id="location" placeholder="City, State (e.g., Dallas, TX)" value={location} onChange={e => setLocation(e.target.value)} />
                  <p className="text-xs text-muted-foreground">
                    Helps us provide local resources and services
                  </p>
                </div>
              </div>}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button> : <div></div>}
            <Button onClick={handleContinue}>
              {step === 2 ? "Complete Setup" : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>;
};
export default Onboarding;
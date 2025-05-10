
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanSelectionProps {
  selectedPlan: string;
  onSelectPlan: (plan: string) => void;
  onContinue: () => void;
}

const PlanSelection = ({ selectedPlan, onSelectPlan, onContinue }: PlanSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className={`border-2 cursor-pointer transition-all ${selectedPlan === "basic" ? "border-primary" : "hover:border-primary/50"}`}
          onClick={() => onSelectPlan("basic")}
        >
          <CardHeader>
            <CardTitle className="text-xl">Basic Plan</CardTitle>
            <CardDescription>Essential features</CardDescription>
            <div className="mt-2">
              <div className="text-2xl font-bold">Free for 7 days</div>
              <div className="text-sm text-muted-foreground">Then $7.99/month</div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Basic symptom tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Limited calendar features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Community forum access</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {selectedPlan === "basic" && (
              <div className="text-primary font-medium">Selected</div>
            )}
          </CardFooter>
        </Card>

        <Card 
          className={`border-2 cursor-pointer transition-all ${selectedPlan === "premium" ? "border-primary" : "hover:border-primary/50"}`}
          onClick={() => onSelectPlan("premium")}
        >
          <CardHeader>
            <div className="absolute -top-3 right-4 bg-primary text-white text-xs px-2 py-1 rounded-full">
              POPULAR
            </div>
            <CardTitle className="text-xl">Premium Plan</CardTitle>
            <CardDescription>Enhanced features</CardDescription>
            <div className="mt-2">
              <div className="text-2xl font-bold">$9.99<span className="text-base font-normal text-muted-foreground">/month</span></div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Advanced symptom tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Full calendar management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Complete resource library</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Personalized insights</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {selectedPlan === "premium" && (
              <div className="text-primary font-medium">Selected</div>
            )}
          </CardFooter>
        </Card>

        <Card 
          className={`border-2 cursor-pointer transition-all ${selectedPlan === "family" ? "border-primary" : "hover:border-primary/50"}`}
          onClick={() => onSelectPlan("family")}
        >
          <CardHeader>
            <CardTitle className="text-xl">Family Plan</CardTitle>
            <CardDescription>Support for caregivers</CardDescription>
            <div className="mt-2">
              <div className="text-2xl font-bold">$19.99<span className="text-base font-normal text-muted-foreground">/month</span></div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>All Premium features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Multiple user accounts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Caregiver resources</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>24/7 emergency support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {selectedPlan === "family" && (
              <div className="text-primary font-medium">Selected</div>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={onContinue} className="gap-2">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlanSelection;

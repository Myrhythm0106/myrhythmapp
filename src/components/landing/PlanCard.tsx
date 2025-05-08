
import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PlanCardProps {
  title: string;
  description: string;
  price: React.ReactNode;
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  isPopular?: boolean;
  onSelectPlan: (plan: string) => void;
}

const PlanCard = ({
  title,
  description,
  price,
  features,
  buttonText,
  buttonVariant = "default",
  isPopular = false,
  onSelectPlan
}: PlanCardProps) => {
  const planId = title.toLowerCase().replace(' plan', '');
  
  return (
    <Card className={`border-2 ${isPopular ? 'border-primary' : ''} relative transition-all hover:shadow-lg`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          MOST POPULAR
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          {price}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={buttonVariant}
          onClick={() => onSelectPlan(planId)}
        >
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;

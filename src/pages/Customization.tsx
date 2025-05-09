
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Brain, Layout, ArrowRight, Check as CheckIcon } from "lucide-react";
import { toast } from "sonner";

type UserType = "productivity" | "cognitive" | "comprehensive";

const Customization = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleContinue = () => {
    if (!selectedType) {
      toast.error("Please select an option to continue");
      return;
    }
    
    // In a real app, we'd save this preference to the user's profile
    toast.success("Preferences saved successfully!");
    navigate("/profile");
  };

  const userTypes = [
    {
      id: "productivity",
      title: "Productivity Focus",
      description: "I want to be more organized and productive in my daily life",
      icon: <Layout className="h-10 w-10 text-primary" />,
    },
    {
      id: "cognitive",
      title: "Cognitive Support",
      description: "I need support with memory and cognitive challenges",
      icon: <Brain className="h-10 w-10 text-primary" />,
    },
    {
      id: "comprehensive",
      title: "Comprehensive Solution",
      description: "I want the full MyRhythm experience with all features",
      icon: <Check className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/10 py-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <PageHeader
          title="Customize Your Experience"
          subtitle="Tell us a bit about your needs so we can tailor MyRhythm for you"
        />

        <div className="space-y-4">
          {userTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedType === type.id
                  ? "border-2 border-primary shadow-lg"
                  : "border border-border"
              }`}
              onClick={() => setSelectedType(type.id as UserType)}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="rounded-full bg-primary/10 p-2">{type.icon}</div>
                <div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </div>
                {selectedType === type.id && (
                  <CheckIcon className="ml-auto h-5 w-5 text-primary" />
                )}
              </CardHeader>
              <CardContent>
                <CardDescription>{type.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          className="w-full py-6 text-lg font-medium rounded-xl bg-gradient-to-r from-primary to-secondary/90 shadow-lg hover:shadow-xl transition-all"
          disabled={!selectedType}
        >
          <span>Continue</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Customization;

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Heart, CheckCircle } from "lucide-react";
import { UserType } from "@/types/user";

interface AffirmationUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: UserType;
  currentCategory: string;
  onUpgrade: () => void;
}

export function AffirmationUpgradeModal({ isOpen, onClose, userType, currentCategory, onUpgrade }: AffirmationUpgradeModalProps) {
  const isBrainInjury = userType === "brain-injury";

  const benefits = [
    {
      id: 1,
      title: "Unlock All Affirmations",
      description: "Access 700+ powerful statements",
      icon: Sparkles,
    },
    {
      id: 2,
      title: "Personalized Categories",
      description: "Curated content for your specific needs",
      icon: Heart,
    },
    {
      id: 3,
      title: "Ad-Free Experience",
      description: "Focus without distractions",
      icon: CheckCircle,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <p className="text-gray-600">
            Unlock the full potential of MyRhythm and supercharge your journey.
          </p>

          <ul className="list-none space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit.id} className="flex items-center gap-3">
                <benefit.icon className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{benefit.title}</p>
                  <p className="text-sm text-gray-500">{benefit.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              Current Category: {currentCategory}
            </Badge>
            <Badge variant="outline">
              {isBrainInjury ? "Brain Injury Support" : "General Wellness"}
            </Badge>
          </div>
        </div>

        <Button onClick={onUpgrade} className="w-full">
          Unlock Premium Features
        </Button>
      </DialogContent>
    </Dialog>
  );
}

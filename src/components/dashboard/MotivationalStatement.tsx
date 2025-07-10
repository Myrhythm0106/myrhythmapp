
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Heart, Target, Sparkles } from 'lucide-react';

interface MotivationalStatementProps {
  userType?: "brain-injury" | "caregiver" | "cognitive-optimization" | "wellness";
  userName?: string;
}

export function MotivationalStatement({ userType, userName = "Champion" }: MotivationalStatementProps) {
  const getStatement = () => {
    switch (userType) {
      case "brain-injury":
        return {
          title: "Your Recovery Journey",
          statement: `${userName}, every step forward is a victory. Your brain's incredible ability to heal and adapt grows stronger each day.`,
          icon: Brain,
          gradient: "from-blue-500 to-teal-500"
        };
      case "caregiver":
        return {
          title: "Your Caring Heart",
          statement: `${userName}, your love and support create healing spaces. Remember to care for yourself as you care for others.`,
          icon: Heart,
          gradient: "from-rose-500 to-pink-500"
        };
      case "cognitive-optimization":
        return {
          title: "Your Mental Mastery",
          statement: `${userName}, you're building cognitive excellence. Every challenge you embrace expands your mental capabilities.`,
          icon: Target,
          gradient: "from-purple-500 to-indigo-500"
        };
      case "wellness":
        return {
          title: "Your Wellness Journey",
          statement: `${userName}, you're creating sustainable systems for success. Balance and growth work hand in hand.`,
          icon: Sparkles,
          gradient: "from-green-500 to-emerald-500"
        };
      default:
        return {
          title: "Your Unique Journey",
          statement: `${userName}, you have everything within you to create positive change. Trust your journey.`,
          icon: Heart,
          gradient: "from-blue-500 to-purple-500"
        };
    }
  };

  const { title, statement, icon: Icon, gradient } = getStatement();

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardContent className={`p-6 bg-gradient-to-r ${gradient} text-white relative`}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          
          <p className="text-white/95 leading-relaxed text-base">
            {statement}
          </p>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
      </CardContent>
    </Card>
  );
}

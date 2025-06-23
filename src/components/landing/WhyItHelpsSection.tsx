
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Award, Layout, UserPlus, Heart, Star } from "lucide-react";

type BenefitProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Benefit({ icon, title, description }: BenefitProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function WhyItHelpsSection() {
  const navigate = useNavigate();
  const benefits: BenefitProps[] = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Transforms Overwhelm into Clarity",
      description: "By breaking down big dreams into achievable, empowering steps."
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Builds Unshakeable Confidence",
      description: "Every success reinforces your incredible ability to thrive and grow."
    },
    {
      icon: <Layout className="h-6 w-6 text-primary" />,
      title: "Creates Empowering Structure",
      description: "A personalized rhythm that brings peace, clarity, and momentum to your day."
    },
    {
      icon: <UserPlus className="h-6 w-6 text-primary" />,
      title: "Amplifies Your Power",
      description: "It's about your choices, your pace, your amazing progress and potential."
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Enhances Life Satisfaction",
      description: "Finding your rhythm creates deep purpose, joy, and inner strength."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary flex items-center justify-center gap-2">
            <Star className="h-8 w-8" />
            Why MYRHYTHM Empowers You to Thrive
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our empowering approach transforms challenges into strengths and helps you flourish
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Benefit 
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

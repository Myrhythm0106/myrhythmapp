
import React from "react";
import { Shield, Award, Layout, UserPlus, Heart } from "lucide-react";

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
  const benefits: BenefitProps[] = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Reduces Overwhelm",
      description: "By breaking down big goals into manageable steps."
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Builds Confidence",
      description: "Every small success reinforces your ability to take charge."
    },
    {
      icon: <Layout className="h-6 w-6 text-primary" />,
      title: "Creates Structure",
      description: "A predictable routine can bring peace and clarity."
    },
    {
      icon: <UserPlus className="h-6 w-6 text-primary" />,
      title: "Empowers You",
      description: "It's about your choices, your pace, your progress."
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Enhances Well-being",
      description: "Finding your rhythm fosters a sense of purpose and calm."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">Why MYRHYTHM Can Help You Thrive</h2>
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

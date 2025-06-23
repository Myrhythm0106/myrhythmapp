
import React from "react";
import { Shield, Award, Layout, Heart } from "lucide-react";

type BenefitProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Benefit({ icon, title, description }: BenefitProps) {
  return (
    <div className="flex items-start gap-4 text-center">
      <div className="bg-primary/10 p-3 rounded-full mx-auto">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

export function WhyItHelpsSection() {
  const benefits: BenefitProps[] = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Clarity Over Chaos",
      description: "Transform overwhelming challenges into manageable, empowering steps."
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Build Confidence",
      description: "Every success reinforces your incredible ability to grow and thrive."
    },
    {
      icon: <Layout className="h-6 w-6 text-primary" />,
      title: "Create Structure",
      description: "Develop a personalized rhythm that brings peace and momentum to your day."
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Find Your Flow",
      description: "Discover the rhythm that enhances your life satisfaction and inner strength."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Why MyRhythm Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our empowering approach helps you flourish
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <Benefit 
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

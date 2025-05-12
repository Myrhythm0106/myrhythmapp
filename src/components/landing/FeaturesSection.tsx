
import React from "react";
import { ShieldCheck, Heart, Compass, Network } from "lucide-react";
import Feature from "./Feature";

const FeaturesSection = () => {
  const features = [{
    icon: <ShieldCheck className="h-10 w-10 text-annabel-600" />,
    title: "Enhanced Mind. Organise Forward.",
    description: "MyRhythm doesn't just remind, it anticipates. By understanding your rhythm, it proactively suggests optimal schedules and breaks down complex tasks."
  }, {
    icon: <Compass className="h-10 w-10 text-annabel-600" />,
    title: "Visualise Progress. Routine Wins.",
    description: "Our revolutionary Visual Flow Builder transforms your day into an intuitive, drag-and-drop map of success. See the path, own the process."
  }, {
    icon: <Heart className="h-10 w-10 text-annabel-600" />,
    title: "Understand Emotions. Achieve More.",
    description: "MyRhythm's gentle emotional check-ins reveal powerful connections between mood and achievement, converting self-awareness into actionable productivity strategies."
  }, {
    icon: <Network className="h-10 w-10 text-annabel-600" />,
    title: "Connect Within. Fuel Momentum.",
    description: "The network and support that understand and motivate and encourage you every step of your journey."
  }];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Align Your Emotions for Peak Performance</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            MyRhythm combines cutting-edge technology with human-centered design to help you achieve more with less stress.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

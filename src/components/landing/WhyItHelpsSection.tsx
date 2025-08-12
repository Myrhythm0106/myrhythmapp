
import React from "react";
import { Shield, Award, Layout, Heart } from "lucide-react";

type BenefitProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Benefit({ icon, title, description }: BenefitProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-teal-100 p-4 rounded-full shadow-md">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function WhyItHelpsSection() {
  const benefits: BenefitProps[] = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "You Have the Power",
      description: "Take control of your cognitive journey with personalized strategies that work."
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "You're Making Progress",
      description: "Celebrate every win and build unstoppable momentum toward your goals."
    },
    {
      icon: <Layout className="h-6 w-6 text-primary" />,
      title: "You Can Trust Yourself",
      description: "Develop systems that support your unique rhythm and cognitive strengths."
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "You Are Enough",
      description: "Embrace your journey exactly where you are and watch yourself flourish."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-purple-50/60 via-blue-50/50 to-teal-50/60">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            Why MyRhythm Transforms Lives
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            Instead of judgment and frustration, you'll experience empowerment and confidence every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center bg-gradient-to-br from-white via-purple-50/20 to-blue-50/15 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-200/30">
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

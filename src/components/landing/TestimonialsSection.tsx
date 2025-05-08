
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TestimonialCard from "./TestimonialCard";

const TestimonialsSection = () => {
  const navigate = useNavigate();
  
  const testimonials = [
    {
      quote: "MyRhythm has completely transformed how I manage my day. I feel in control for the first time in years.",
      author: "Alex D."
    }, 
    {
      quote: "The emotional insights feature helped me understand my patterns and make meaningful changes to my routine.",
      author: "Morgan T."
    }, 
    {
      quote: "As a caregiver, the family plan features have made coordinating care so much easier and less stressful.",
      author: "Jamie L."
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have improved their brain health journey with MyRhythm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button size="lg" className="text-lg px-8" onClick={() => navigate("/onboarding?plan=basic&step=3")}>
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

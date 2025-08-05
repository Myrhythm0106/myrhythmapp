
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star, Quote, ArrowRight, Heart } from "lucide-react";

const TestimonialsSection = () => {
  const navigate = useNavigate();
  
  const testimonials = [
    {
      quote: "I went from forgetting my kids' names to helping them with homework. MyRhythm gave me my identity back.",
      author: "Maria C.",
      condition: "Stroke Survivor, 2 years recovery",
      rating: 5,
      highlight: "Identity Restored"
    }, 
    {
      quote: "My husband and I were falling apart. Now we're stronger than ever. MyRhythm saved our marriage and our family.",
      author: "David & Jennifer K.",
      condition: "TBI Recovery Journey",
      rating: 5,
      highlight: "Marriage Saved"
    }, 
    {
      quote: "From dependent to independent in 6 months. I'm driving again, working again, LIVING again.",
      author: "Marcus T.",
      condition: "Concussion Recovery",
      rating: 5,
      highlight: "Independence Regained"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 mb-6">
            <span className="text-emerald-700 font-bold">💪 REAL STORIES, REAL VICTORIES</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            They Did It.
            <br />
            <span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
              So Can You.
            </span>
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-light">
            Real survivors. Real transformations. Real hope.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-8 shadow-2xl border border-emerald-100 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Highlight badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm">
                {testimonial.highlight}
              </div>

              <div className="mb-6 pt-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <Quote className="h-12 w-12 text-emerald-500/30 mb-4" />
              </div>

              <p className="text-xl text-gray-800 font-medium italic leading-relaxed mb-6 group-hover:text-emerald-700 transition-colors">
                "{testimonial.quote}"
              </p>

              <div className="border-t border-emerald-100 pt-6">
                <p className="font-bold text-emerald-700 text-lg">{testimonial.author}</p>
                <p className="text-gray-600 font-medium">{testimonial.condition}</p>
              </div>

              {/* Hover effect */}
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          ))}
        </div>

        {/* Powerful CTA */}
        <div className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <Heart className="h-16 w-16 mx-auto mb-6 text-white/80" />
            <h3 className="text-4xl font-black mb-4">Your Victory Story Starts Now</h3>
            <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
              Join 2,847 survivors who've transformed their lives. Your breakthrough is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-xl px-12 py-6 bg-white text-emerald-600 hover:bg-emerald-50 font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all"
                onClick={() => navigate("/onboarding")}
              >
                Start My Recovery Journey
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <div className="text-emerald-200 font-medium">
                Free access • No credit card • Join in 60 seconds
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

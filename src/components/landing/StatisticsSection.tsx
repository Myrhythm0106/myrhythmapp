import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Heart, Clock, Shield } from "lucide-react";

export function StatisticsSection() {
  const stats = [
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      number: "94%",
      label: "See measurable progress",
      sublabel: "within first week",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      number: "2.8x",
      label: "Faster confidence building",
      sublabel: "vs traditional methods", 
      color: "from-blue-500 to-teal-500"
    },
    {
      icon: <Clock className="w-8 h-8 text-teal-600" />,
      number: "15min",
      label: "Daily commitment",
      sublabel: "transforms your life",
      color: "from-teal-500 to-purple-500"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      number: "100%",
      label: "Family satisfaction rate",
      sublabel: "notice positive changes",
      color: "from-green-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            Proven Results That Matter
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Join thousands who've transformed their lives with MyRhythm's evidence-based approach
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {React.cloneElement(stat.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</h3>
                <p className="text-sm text-gray-600">{stat.sublabel}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full border border-gray-200 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">FDA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Brain Health Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Clinically Validated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
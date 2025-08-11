import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, ArrowRight, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const demoSteps = [
    {
      title: "Quick Assessment",
      description: "Answer 5 simple questions about your daily challenges",
      preview: "How often do you feel overwhelmed by simple tasks?",
      icon: <Brain className="w-6 h-6" />,
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Personalized Analysis", 
      description: "Get instant insights into your cognitive patterns",
      preview: "Your brain works best between 10am-2pm. Let's build on that!",
      icon: <Target className="w-6 h-6" />,
      color: "from-blue-500 to-teal-500"
    },
    {
      title: "Custom Rhythm Plan",
      description: "Receive your personalized MYRHYTHM framework",
      preview: "Your plan includes 3 memory anchors and 2 energy breaks daily",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-teal-500 to-purple-500"
    }
  ];

  const handleStartDemo = () => {
    navigate("/auth");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-teal-50/40">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            See MyRhythm in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Experience how our assessment creates your personalized recovery plan in minutes, not weeks
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Demo Steps */}
          <div className="space-y-6">
            {demoSteps.map((step, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-500 border-2 ${
                  currentStep === index 
                    ? 'border-purple-300 shadow-xl scale-105 bg-white' 
                    : 'border-gray-200 shadow-md hover:shadow-lg bg-white/80'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white transition-all duration-300`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    {currentStep === index && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Preview */}
          <div className="relative">
            <Card className="bg-white shadow-2xl border-2 border-purple-200/50 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Live Preview</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Real-time Demo</span>
                  </div>
                </div>
                
                {/* Dynamic Content */}
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl bg-gradient-to-r ${demoSteps[currentStep].color} bg-opacity-10 border border-purple-200`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${demoSteps[currentStep].color} flex items-center justify-center text-white`}>
                        {demoSteps[currentStep].icon}
                      </div>
                      <h4 className="font-semibold text-gray-800">{demoSteps[currentStep].title}</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {demoSteps[currentStep].preview}
                    </p>
                  </div>

                  {currentStep === 0 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" size="sm" className="text-left justify-start">Daily</Button>
                        <Button variant="outline" size="sm" className="text-left justify-start bg-purple-100 border-purple-300">Weekly</Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" size="sm" className="text-left justify-start">Rarely</Button>
                        <Button variant="outline" size="sm" className="text-left justify-start">Never</Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-800">High cognitive energy detected: 10am-2pm</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-blue-800">Optimal focus window: 45-minute blocks</span>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">Your Personalized Plan:</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Morning memory anchor at 10am</li>
                          <li>• Energy break every 45 minutes</li>
                          <li>• Evening reflection ritual</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 text-center">
                  <Button 
                    onClick={handleStartDemo}
                    className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
                  >
                    Start Your Real Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Free 7-day trial • No credit card required
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-teal-400 to-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
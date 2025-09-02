import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, MessageCircle, Video, Users, FileText, Heart } from "lucide-react";

export function Help() {
  const navigate = useNavigate();

  const helpTopics = [
    {
      title: "Getting Started",
      description: "Learn the basics of MyRhythm and setup your account",
      icon: BookOpen,
      action: () => navigate("/help/getting-started")
    },
    {
      title: "Memory Bridge",
      description: "How to use voice recordings and meeting transcription",
      icon: Video,
      action: () => navigate("/help/memory-bridge")
    },
    {
      title: "Support Circle",
      description: "Managing your care team and family connections",
      icon: Users,
      action: () => navigate("/help/support-circle")
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: MessageCircle,
      action: () => window.open('mailto:support@myrhythm.com?subject=Support Request', '_blank')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50/30 via-clarity-teal-50/30 to-memory-emerald-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text-brand">Help Center</h1>
          </div>
        </div>

        {/* Welcome */}
        <Card className="border-brain-health-200/50">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-brain-health-900">
                How can we help you today?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions, learn about features, or get in touch with our support team.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Topics */}
        <div className="grid md:grid-cols-2 gap-6">
          {helpTopics.map((topic, index) => (
            <Card key={index} className="border-brain-health-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={topic.action}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <topic.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg therapeutic-accent">{topic.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{topic.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contact */}
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-red-800">Need Immediate Help?</h3>
              <p className="text-red-700">
                If you're experiencing a medical emergency, please call 911 or contact your local emergency services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Help;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/ui/BackButton';

const captureDetails = {
  title: 'Capture — Your Memory Bridge',
  color: 'from-memory-emerald-500 to-brain-health-500',
  description: 'Never lose precious moments. Intelligent capture system for conversations, appointments, and memories.',
  detailedDescription: 'Perfect for those moments when your memory needs support. Our intelligent capture system helps you record and organize important conversations, appointments, and memories so nothing precious gets lost.',
  benefits: [
    'Voice recording with intelligent transcription',
    'Automatic conversation summaries',
    'Memory prompts and reminders',
    'Secure, private storage',
    'Easy search and retrieval',
    'Integration with your daily rhythm'
  ]
};

export default function LaunchCapture() {
  const navigate = useNavigate();

  const handleRegisterNow = () => {
    navigate("/launch/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-memory-emerald-50/30">
      {/* Back Button */}
      <div className="p-4">
        <BackButton onClick={() => navigate('/launch')} />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${captureDetails.color} flex items-center justify-center shadow-lg`}>
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-brain-health-900">
            {captureDetails.title}
          </h1>
          <p className="text-lg text-brain-health-700 font-medium">
            {captureDetails.description}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card className="border-memory-emerald-200/50 bg-white/50">
            <CardContent className="p-6">
              <p className="text-brain-health-700 leading-relaxed mb-6">
                {captureDetails.detailedDescription}
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-brain-health-900 mb-3">What you can expect to experience:</h4>
                <div className="grid gap-2">
                  {captureDetails.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${captureDetails.color}`} />
                      <span className="text-brain-health-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <p className="text-brain-health-600 font-medium">
              Ready to experience the difference?
            </p>
            <Button 
              onClick={handleRegisterNow}
              size="lg"
              className={`bg-gradient-to-r ${captureDetails.color} hover:opacity-90 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-full`}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Register Now - 7 Day Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-sm text-brain-health-500">
              No commitment. Cancel anytime. Start your journey today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

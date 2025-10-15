import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Users, FileText, Network, CheckCircle, ArrowRight } from 'lucide-react';

interface MedicalProfessionalWelcomeProps {
  onStartJourney: () => void;
}

export function MedicalProfessionalWelcome({ onStartJourney }: MedicalProfessionalWelcomeProps) {
  const features = [
    {
      icon: Users,
      title: 'Patient Empowerment',
      description: 'Recommend MyRhythm for daily cognitive support between appointments'
    },
    {
      icon: FileText,
      title: 'Progress Insights',
      description: 'Patients can share their wellness patterns and progress with you'
    },
    {
      icon: CheckCircle,
      title: 'Appointment Preparation',
      description: 'Patients arrive organized with Memory Bridge recordings and tracked activities'
    },
    {
      icon: Network,
      title: 'Professional Network',
      description: 'Connect with other providers using cognitive wellness tools in practice'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-blue-50 to-neural-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-neural-blue-500 to-neural-indigo-500 rounded-full mb-6 shadow-lg">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neural-blue-700 to-neural-indigo-700 bg-clip-text text-transparent">
            Help Your Patients Remember
          </h1>
          <p className="text-lg text-neural-blue-600 mb-2 italic">
            No One Walks Alone
          </p>
          <p className="text-xl text-neural-blue-700 max-w-2xl mx-auto">
            MyRhythm gives your patients tools to manage cognitive wellness between appointments—empowering independence while you guide their care.
          </p>
        </motion.div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-neural-blue-500 to-neural-indigo-500 rounded-full flex items-center justify-center">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neural-blue-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-neural-blue-700">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-neural-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-neural-blue-600 text-center">
                <strong>Important:</strong> MyRhythm is designed for patient self-management and wellness support, not as a clinical diagnostic tool.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-neural-blue-500 to-neural-indigo-500 border-0 shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Explore MyRhythm for Your Practice
              </h2>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Join healthcare providers empowering patients with cognitive wellness tools.
              </p>
              <Button
                onClick={onStartJourney}
                size="lg"
                className="bg-white text-neural-blue-700 hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-200"
              >
                <Stethoscope className="h-5 w-5 mr-2" />
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-white/80 text-sm mt-4">
                Schedule a demo • Professional resources • Care coordination tools
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Users, Briefcase, BookOpen, Heart, Star, Sparkles, ArrowRight, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const userTypes = [
  {
    id: 'brain-injury',
    title: 'Brain Injury Navigator',
    description: 'Rebuilding cognitive skills after TBI, stroke, or concussion',
    icon: Brain,
    color: 'from-brand-emerald-500 to-brand-teal-500',
    bgColor: 'bg-brand-emerald-50',
  },
  {
    id: 'caregiver',
    title: 'Family Member / Caregiver',
    description: 'Supporting a loved one on their cognitive journey',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
  },
  {
    id: 'medical-professional',
    title: 'Medical Professional',
    description: 'Healthcare provider supporting patient outcomes',
    icon: Stethoscope,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'student',
    title: 'Student',
    description: 'Managing academic life and study productivity',
    icon: BookOpen,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50',
  },
  {
    id: 'executive',
    title: 'Executive / Professional',
    description: 'High-performer optimizing productivity',
    icon: Briefcase,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'wellness',
    title: 'General Wellness',
    description: 'Improving overall cognitive health and daily rhythm',
    icon: Star,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
  },
];

export default function LaunchUserType() {
  const navigate = useNavigate();

  const handleSelect = (userTypeId: string) => {
    localStorage.setItem('myrhythm_user_type', userTypeId);
    navigate('/launch/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-emerald-100 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-brand-emerald-600" />
            <span className="text-sm font-medium text-brand-emerald-700">Personalize Your Experience</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What brings you to MyRhythm?
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            We'll tailor your experience based on your unique needs
          </p>
        </motion.div>

        {/* User Type Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-brand-emerald-300 bg-white/80 backdrop-blur-sm"
                onClick={() => handleSelect(type.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <type.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Skip option */}
        <div className="text-center">
          <button
            onClick={() => {
              localStorage.setItem('myrhythm_user_type', 'wellness');
              navigate('/launch/payment');
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { 
  HelpCircle, ChevronLeft, ChevronDown, ChevronUp,
  MessageCircle, Mail, Book, Video, ExternalLink,
  Brain, Calendar, Users, Sparkles, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function LaunchHelp() {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I get started with MyRhythm?',
      answer: 'Start by completing the quick assessment to personalize your experience. Then explore the dashboard to see your daily actions, try a brain game, or write in your gratitude journal.',
      category: 'Getting Started'
    },
    {
      id: '2',
      question: 'What are brain games and how do they help?',
      answer: 'Brain games are cognitive exercises designed to improve memory, focus, and mental agility. Regular practice can help strengthen neural pathways and support cognitive health.',
      category: 'Features'
    },
    {
      id: '3',
      question: 'How do I add someone to my Support Circle?',
      answer: 'Go to Support Circle from the navigation, tap "Add Member" and enter their email. They\'ll receive an invitation to join and support your journey.',
      category: 'Support Circle'
    },
    {
      id: '4',
      question: 'How do I connect my calendar?',
      answer: 'Go to Settings > Connected Calendars and tap "Connect Google Calendar" or "Connect Outlook". Follow the prompts to authorize MyRhythm to view your events.',
      category: 'Features'
    },
    {
      id: '5',
      question: 'What happens to my recordings?',
      answer: 'Recordings are securely stored and can be automatically deleted after transcription. You can set your preferred retention period in Settings > Storage Management.',
      category: 'Privacy'
    },
    {
      id: '6',
      question: 'Can I use MyRhythm offline?',
      answer: 'Some features like brain games and gratitude journaling work offline. Your data will sync when you\'re back online.',
      category: 'Features'
    },
  ];

  const quickLinks = [
    { icon: Brain, label: 'Brain Games Guide', href: '#' },
    { icon: Calendar, label: 'Calendar Tips', href: '#' },
    { icon: Users, label: 'Support Circle Help', href: '#' },
    { icon: Heart, label: 'Gratitude Guide', href: '#' },
  ];

  return (
    <LaunchLayout showHeader={true}>
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500 text-sm mt-1">We're here to help you succeed</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LaunchCard className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
            <MessageCircle className="h-8 w-8 text-brand-emerald-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Live Chat</p>
            <p className="text-xs text-gray-500">Available 9am-5pm</p>
          </LaunchCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <LaunchCard className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
            <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Email Us</p>
            <p className="text-xs text-gray-500">support@myrhythm.app</p>
          </LaunchCard>
        </motion.div>
      </div>

      {/* Quick Links */}
      <LaunchCard className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Book className="h-5 w-5 text-purple-600" />
          Quick Guides
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.map((link, index) => (
            <button
              key={link.label}
              className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <link.icon className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{link.label}</span>
            </button>
          ))}
        </div>
      </LaunchCard>

      {/* Video Tutorials */}
      <LaunchCard className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Video className="h-5 w-5 text-red-600" />
            Video Tutorials
          </h3>
          <button className="text-sm text-brand-emerald-600 font-medium flex items-center gap-1">
            View All
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
        <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
          <div className="text-center">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Getting Started Tutorial</p>
            <p className="text-xs text-gray-400">3 min video</p>
          </div>
        </div>
      </LaunchCard>

      {/* FAQs */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-600" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-2">
          {faqs.map((faq) => (
            <LaunchCard 
              key={faq.id} 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{faq.question}</p>
                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                        <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {faq.category}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </div>
            </LaunchCard>
          ))}
        </div>
      </div>

      {/* Still Need Help */}
      <LaunchCard variant="featured" className="mb-24">
        <div className="text-center">
          <Sparkles className="h-8 w-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Still need help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Our support team is here to assist you
          </p>
          <LaunchButton className="w-full">
            Contact Support
          </LaunchButton>
        </div>
      </LaunchCard>
    </LaunchLayout>
  );
}

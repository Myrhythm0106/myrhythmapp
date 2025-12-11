import React from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { 
  Sparkles, Brain, Calendar, Users, Zap, 
  Bell, Shield, Palette, ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLaunchMode } from '@/hooks/useLaunchMode';
import { Badge } from '@/components/ui/badge';

interface Update {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: 'feature' | 'improvement' | 'fix';
  isNew?: boolean;
}

export default function LaunchWhatsNew() {
  const navigate = useNavigate();
  const { markWhatsNewViewed } = useLaunchMode();

  React.useEffect(() => {
    markWhatsNewViewed('0.2.0');
  }, [markWhatsNewViewed]);

  const updates: Update[] = [
    {
      id: '1',
      version: '0.2.0',
      date: 'December 2024',
      title: 'New Launch Experience',
      description: 'Completely redesigned app with a fresh, mobile-first interface. Enjoy faster navigation and a more intuitive layout.',
      icon: Sparkles,
      type: 'feature',
      isNew: true,
    },
    {
      id: '2',
      version: '0.2.0',
      date: 'December 2024',
      title: 'Enhanced Brain Games',
      description: 'New memory challenges and cognitive exercises to help strengthen your mental fitness.',
      icon: Brain,
      type: 'feature',
      isNew: true,
    },
    {
      id: '3',
      version: '0.2.0',
      date: 'December 2024',
      title: 'Calendar Integration',
      description: 'Connect Google Calendar and Outlook to see all your events in one place.',
      icon: Calendar,
      type: 'feature',
      isNew: true,
    },
    {
      id: '4',
      version: '0.2.0',
      date: 'December 2024',
      title: 'Support Circle Updates',
      description: 'Improved messaging and notification system for your support network.',
      icon: Users,
      type: 'improvement',
    },
    {
      id: '5',
      version: '0.1.5',
      date: 'November 2024',
      title: 'Performance Boost',
      description: 'Faster loading times and smoother animations throughout the app.',
      icon: Zap,
      type: 'improvement',
    },
    {
      id: '6',
      version: '0.1.5',
      date: 'November 2024',
      title: 'Smart Notifications',
      description: 'More helpful reminders that adapt to your daily patterns.',
      icon: Bell,
      type: 'feature',
    },
    {
      id: '7',
      version: '0.1.4',
      date: 'October 2024',
      title: 'Privacy Controls',
      description: 'New settings to manage your data and privacy preferences.',
      icon: Shield,
      type: 'feature',
    },
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'feature':
        return <Badge className="bg-brand-emerald-100 text-brand-emerald-700">New Feature</Badge>;
      case 'improvement':
        return <Badge className="bg-blue-100 text-blue-700">Improvement</Badge>;
      case 'fix':
        return <Badge className="bg-gray-100 text-gray-700">Bug Fix</Badge>;
      default:
        return null;
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">What's New</h1>
        <p className="text-gray-500 text-sm mt-1">Latest updates and improvements</p>
      </div>

      {/* Latest Version Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LaunchCard variant="featured" className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-emerald-400 to-brand-teal-500 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Version</p>
              <p className="text-2xl font-bold text-gray-900">v0.2.0</p>
              <p className="text-xs text-gray-500">Released December 2024</p>
            </div>
          </div>
        </LaunchCard>
      </motion.div>

      {/* Updates List */}
      <div className="space-y-4 pb-24">
        {updates.map((update, index) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <LaunchCard className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  update.isNew 
                    ? 'bg-gradient-to-br from-brand-emerald-400 to-brand-teal-500' 
                    : 'bg-gray-100'
                }`}>
                  <update.icon className={`h-5 w-5 ${update.isNew ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900">{update.title}</h3>
                    {update.isNew && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{update.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>v{update.version}</span>
                    <span>•</span>
                    <span>{update.date}</span>
                  </div>
                </div>
              </div>
            </LaunchCard>
          </motion.div>
        ))}
      </div>
    </LaunchLayout>
  );
}

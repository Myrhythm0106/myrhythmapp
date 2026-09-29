import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, User, ArrowRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JourneyLayout } from '@/components/journey/JourneyLayout';
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation';

type SupportChoice = 'yes' | 'open' | 'alone';

interface SupportOption {
  value: SupportChoice;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const supportOptions: SupportOption[] = [
  {
    value: 'yes',
    icon: <Users className="w-7 h-7" />,
    title: "Yes, I have support",
    description: "Family, friends, or caregivers help me"
  },
  {
    value: 'open',
    icon: <Heart className="w-7 h-7" />,
    title: "Not yet, but I'm open",
    description: "I'd like to build my support network"
  },
  {
    value: 'alone',
    icon: <User className="w-7 h-7" />,
    title: "I prefer independence",
    description: "I'll manage on my own for now"
  }
];

export default function JourneySupportCircle() {
  const navigate = useNavigate();
  const { updateState } = useJourneyNavigation();
  const [selectedChoice, setSelectedChoice] = useState<SupportChoice | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleSelect = (choice: SupportChoice) => {
    setSelectedChoice(choice);
    if (choice === 'yes') {
      setShowInviteForm(true);
    } else {
      // Auto-advance after short delay
      setTimeout(() => {
        updateState({ hasSupport: choice !== 'alone', currentStep: 5 });
        navigate('/journey/brain-injury/ready');
      }, 300);
    }
  };

  const handleContinue = () => {
    // Save invite info if provided
    updateState({ 
      hasSupport: selectedChoice === 'yes' || selectedChoice === 'open',
      currentStep: 5 
    });
    navigate('/journey/brain-injury/ready');
  };

  const handleBack = () => {
    if (showInviteForm) {
      setShowInviteForm(false);
      setSelectedChoice(null);
    } else {
      navigate('/journey/brain-injury/assessment');
    }
  };

  return (
    <JourneyLayout
      currentStep={4}
      totalSteps={5}
      onBack={handleBack}
      showBack={true}
    >
      <AnimatePresence mode="wait">
        {!showInviteForm ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Hero Section */}
            <div className="text-center mb-8">
              <motion.div
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 flex items-center justify-center mb-6 shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Users className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h1
                className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Do you have people who support you?
              </motion.h1>

              <motion.p
                className="text-base text-muted-foreground max-w-sm mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your support circle can help you stay on track
              </motion.p>
            </div>

            {/* Support Options */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {supportOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    selectedChoice === option.value
                      ? 'border-brand-orange-500 bg-brand-orange-50 dark:bg-brand-orange-500/10'
                      : 'border-border bg-card/80 hover:border-brand-orange-300 hover:bg-card'
                  } active:scale-[0.98]`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      selectedChoice === option.value
                        ? 'bg-brand-orange-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {option.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="invite"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Invite Form */}
            <div className="text-center mb-8">
              <motion.div
                className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 flex items-center justify-center mb-5 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Plus className="w-8 h-8 text-white" />
              </motion.div>

              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Invite a supporter
              </h1>
              <p className="text-sm text-muted-foreground">
                They'll be able to see your progress and cheer you on
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="invite-name" className="text-base font-medium">
                  Their Name
                </Label>
                <Input
                  id="invite-name"
                  type="text"
                  placeholder="e.g., Mom, John, Dr. Smith"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="h-14 text-lg px-4 rounded-xl border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-email" className="text-base font-medium">
                  Their Email
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="supporter@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="h-14 text-lg px-4 rounded-xl border-2"
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleContinue}
                className="w-full h-16 text-lg font-semibold rounded-xl bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white shadow-lg"
              >
                {inviteEmail ? 'Send Invite & Continue' : 'Continue Without Inviting'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <button
                onClick={handleContinue}
                className="w-full text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors py-2"
              >
                I'll add supporters later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </JourneyLayout>
  );
}

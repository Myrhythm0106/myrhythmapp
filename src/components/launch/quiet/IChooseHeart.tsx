import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Heart, Share2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDailyStatement, getNextStatement, todayStorageKey } from '@/data/iChooseStatements';
import { IChoosePickerSheet } from './IChoosePickerSheet';
import { generateAndShareIChoose } from './IChooseShareCard';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { toast } from 'sonner';

export function IChooseHeart() {
  const { fixtures } = useDemoOrLive();
  const supporter = fixtures.supportCircle[0];
  const [statement, setStatement] = useState<string>('');
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const key = todayStorageKey();
    const saved = localStorage.getItem(key);
    setStatement(saved ?? getDailyStatement());
  }, []);

  const persist = (s: string) => {
    localStorage.setItem(todayStorageKey(), s);
    setStatement(s);
  };

  const handleCycle = () => persist(getNextStatement(statement || getDailyStatement()));
  const handleUseTodays = () => persist(getDailyStatement());
  const handlePick = (s: string) => persist(s);

  const handleShare = async () => {
    await generateAndShareIChoose(statement);
  };

  const handleSendToPerson = async () => {
    if (!supporter) return;
    await generateAndShareIChoose(statement, supporter.name);
    toast.success(`Sent to ${supporter.name}`, { description: 'They\'ll know you\'re showing up today.' });
  };

  if (!statement) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--brand-teal-600, 174 72% 33%) / 0.95) 0%, hsl(var(--memory-emerald-500, 158 64% 42%) / 0.92) 50%, hsl(var(--brand-orange-500, 24 95% 53%) / 0.9) 100%)',
        }}
      >
        {/* Soft glow accents */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white/90 text-xs font-medium mb-5">
            <Heart className="h-3 w-3" />
            Today's choice
          </div>
          <motion.h2
            key={statement}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl md:text-5xl leading-tight text-white drop-shadow-sm max-w-3xl mx-auto"
          >
            {statement}
          </motion.h2>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCycle}
              className="text-white hover:bg-white/15 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" /> New one
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPickerOpen(true)}
              className="text-white hover:bg-white/15 hover:text-white"
            >
              Choose my own
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white hover:bg-white/15 hover:text-white"
            >
              <Share2 className="h-4 w-4 mr-1.5" /> Share
            </Button>
            {supporter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendToPerson}
                className="text-white hover:bg-white/15 hover:text-white"
              >
                <Send className="h-4 w-4 mr-1.5" /> Send to {supporter.name}
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <IChoosePickerSheet
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={handlePick}
        onUseTodays={handleUseTodays}
      />
    </>
  );
}

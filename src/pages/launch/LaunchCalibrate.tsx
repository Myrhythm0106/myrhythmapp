import React from 'react';
import {
  Activity,
  HeartPulse,
  LineChart,
  Compass,
  HandHeart,
  BarChart3,
  Sparkle,
} from 'lucide-react';
import { CapabilityPage } from '@/components/launch/chrome/CapabilityPage';

export default function LaunchCalibrate() {
  return (
    <CapabilityPage
      eyebrow="Capability 03 · Calibrate"
      title="A quiet, honest read on how you're really doing."
      lede="Calibrate turns short daily check-ins into a clear picture of mood, energy, and recovery — without judgement, without gamification."
      heroIcon={Activity}
      tone="purple"
      metaPills={[
        { label: 'Available on Plus', tone: 'info' },
        { label: '30-second check-in', tone: 'neutral' },
        { label: 'Pattern-aware', tone: 'success' },
      ]}
      whyParagraphs={[
        'Wellbeing rarely shifts in headlines; it drifts in patterns. Most tools either over-quantify or look away entirely.',
        'Calibrate keeps the cadence light and the insight serious — surfacing the patterns that quietly shape your week, before they shape your year.',
      ]}
      capabilities={[
        { icon: HeartPulse, label: 'Daily mood check-in', description: 'Three taps. No scoring, no streaks.' },
        { icon: LineChart, label: 'Pattern recognition', description: 'Surfaces drift across days, weeks, and contexts.' },
        { icon: Compass, label: 'Personal recommendations', description: 'Small, specific suggestions tied to your rhythm.' },
        { icon: HandHeart, label: 'Non-judgemental design', description: 'No red zones, no shame loops, no comparisons.' },
        { icon: BarChart3, label: 'Progress visualisation', description: 'Plain charts. Real signal. Easy to share.' },
        { icon: Sparkle, label: 'Rhythm tuning', description: 'Calibrate quietly informs Capture and Commit.' },
      ]}
      rhythmSteps={[
        { step: '01', title: 'Check in', description: 'A 30-second pulse on mood and energy.' },
        { step: '02', title: 'Notice', description: 'Patterns gather into clear, readable signals.' },
        { step: '03', title: 'Adjust', description: 'Apply one small change; let the rhythm settle.' },
      ]}
      kpis={[
        { label: 'Daily check-in', value: '30s', caption: 'Designed for low-energy days' },
        { label: 'History', value: '12 mo', caption: 'Trends and exports included' },
        { label: 'Tier', value: 'Plus +', caption: 'Included with Plus and above' },
      ]}
      related={[
        { label: 'Analytics', caption: 'Long-form view of your trends', to: '/launch/analytics' },
        { label: 'Mood tracking', caption: 'Daily ritual surface', to: '/launch/home' },
        { label: 'Clinical Brief', caption: 'Share signal with your team', to: '/launch/clinical-brief' },
      ]}
    />
  );
}

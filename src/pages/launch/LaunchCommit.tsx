import React from 'react';
import {
  CalendarRange,
  Battery,
  Layers,
  Clock,
  BellRing,
  TrendingUp,
  Wand2,
} from 'lucide-react';
import { CapabilityPage } from '@/components/launch/chrome/CapabilityPage';

export default function LaunchCommit() {
  return (
    <CapabilityPage
      capabilityKey="commit"
      eyebrow="Capability 02 · Commit"
      title="A calendar that adapts to your energy, not the other way around."
      lede="Commit organises the day around your cognitive load — protecting focus when it's high, and protecting you when it isn't."
      heroIcon={CalendarRange}
      tone="teal"
      metaPills={[
        { label: 'Overview page — go to Home to plan today', tone: 'info' },
        { label: 'Syncs with Google & Outlook', tone: 'neutral' },
        { label: 'Energy-aware', tone: 'success' },
      ]}
      whyParagraphs={[
        'Standard calendars assume a steady supply of attention. Recovery, caregiving, and demanding work rarely cooperate.',
        'Commit reads your captured rhythm and proposes a structure that honours your real capacity — so each day finishes feeling possible, not punishing.',
      ]}
      capabilities={[
        {
          icon: Battery,
          label: 'Energy-aware scheduling',
          description: 'Plans align with your peaks; protects rest where needed.',
        },
        {
          icon: Layers,
          label: 'Cognitive load balancing',
          description: 'Distributes demanding work across the week, not the day.',
        },
        {
          icon: Clock,
          label: 'Flexible task management',
          description: 'Reschedule with one tap; the rhythm adjusts around you.',
        },
        {
          icon: BellRing,
          label: 'Gentle reminders',
          description: 'Calm, well-timed nudges. Never pestering, never urgent.',
        },
        {
          icon: TrendingUp,
          label: 'Progress signals',
          description: 'See momentum without scoreboards or streak pressure.',
        },
        {
          icon: Wand2,
          label: 'Assistant-first suggestions',
          description: 'Smart proposals you accept or amend — never imposed.',
        },
      ]}
      rhythmSteps={[
        { step: '01', title: 'Propose', description: 'Smart suggestions land in your inbox each morning.' },
        { step: '02', title: 'Commit', description: 'Accept, edit, or defer — your day, your call.' },
        { step: '03', title: 'Adjust', description: 'Plans flex automatically as the day evolves.' },
      ]}
      kpis={[
        { label: 'Average plan time', value: '90s', caption: 'Daily commit ritual' },
        { label: 'Reschedules', value: 'One-tap', caption: 'Across day, week, month' },
        { label: 'Tier', value: 'Plus +', caption: 'Included with Plus and above' },
      ]}
      related={[
        { label: 'Calendar', caption: 'Your live day, week, and month view', to: '/launch/calendar' },
        { label: 'Smart Schedule', caption: 'Energy-aware suggestions', to: '/launch/calendar' },
        { label: 'Settings · calendars', caption: 'Connect Google and Outlook', to: '/launch/settings' },
      ]}
    />
  );
}

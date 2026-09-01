import React from 'react';
import {
  Brain,
  Mic,
  FileSearch,
  Bell,
  Lock,
  Search,
  Workflow,
} from 'lucide-react';
import { CapabilityPage } from '@/components/launch/chrome/CapabilityPage';

export default function LaunchCapture() {
  return (
    <CapabilityPage
      capabilityKey="capture"
      eyebrow="Capability 01 · Capture"
      title="A reliable record of the conversations that matter."
      lede="Capture turns spoken moments — clinical visits, family check-ins, fleeting ideas — into a private, searchable record I can return to with confidence."
      heroIcon={Brain}
      tone="emerald"
      metaPills={[
        { label: 'Overview page — go to Memory Bridge to record', tone: 'info' },
        { label: 'Avg. setup · 4 min', tone: 'neutral' },
        { label: 'On-device first', tone: 'success' },
      ]}
      whyParagraphs={[
        'Memory rarely fails on schedule. The conversations that matter most often arrive when energy is lowest — at the bedside, after a diagnosis, during a difficult call.',
        'Capture gives me a calm, dependable system to record, transcribe, and revisit those moments — so nothing important is left to recall under pressure.',
        'It is just as useful for everyday life: meetings, family plans, creative ideas, or any conversation I may need to trust later.',
      ]}
      capabilities={[
        {
          icon: Mic,
          label: 'Voice capture',
          description: 'One-tap recording with accurate, on-device transcription.',
        },
        {
          icon: FileSearch,
          label: 'Conversation summaries',
          description: 'Decisions, actions, and questions surfaced automatically.',
        },
        {
          icon: Bell,
          label: 'Memory prompts',
          description: 'Gentle, well-timed reminders linked to my rhythm.',
        },
        {
          icon: Lock,
          label: 'Private by default',
          description: 'Encrypted storage, configurable retention, no resale.',
        },
        {
          icon: Search,
          label: 'Search and recall',
          description: 'Find any moment by speaker, date, theme, or quote.',
        },
        {
          icon: Workflow,
          label: 'Rhythm integration',
          description: 'Captures feed Commit and Calibrate without extra effort.',
        },
      ]}
      rhythmSteps={[
        {
          step: '01',
          title: 'Capture',
          description: 'Record what matters — without disrupting the moment.',
        },
        {
          step: '02',
          title: 'Refine',
          description: 'Review summaries; promote actions to my calendar.',
        },
        {
          step: '03',
          title: 'Return',
          description: 'Revisit decisions and details whenever I need them.',
        },
      ]}
      kpis={[
        { label: 'Time to first capture', value: '< 60s', caption: 'From install to recording' },
        { label: 'Retention', value: 'Configurable', caption: 'From 30 days to permanent' },
      ]}
      related={[
        { label: 'Memory Bridge', caption: 'Where captures become structure', to: '/launch/memory' },
        { label: 'Settings · retention', caption: 'Adjust how long recordings stay', to: '/launch/settings' },
        { label: 'Clinical Brief', caption: 'Pre-discharge summary', to: '/launch/clinical-brief' },
      ]}
      primaryCta={{ label: 'Open Memory Bridge', to: '/launch/memory' }}
      secondaryCta={{ label: 'Return to overview', to: '/launch' }}
    />
  );
}

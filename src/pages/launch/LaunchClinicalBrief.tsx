import React from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { TierGate } from '@/components/launch/quiet/TierGate';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DemoModeProvider } from '@/contexts/DemoModeContext';

function BriefBody() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-teal-100 flex items-center justify-center">
          <FileText className="h-6 w-6 text-brand-teal-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brain-health-900">Clinical Brief</h1>
          <p className="text-sm text-brain-health-600">Pre-discharge readiness summary — Bridge Pathway</p>
        </div>
      </div>

      <TierGate required="pro" label="Clinical Brief — unlock with Pro">
        <div className="rounded-3xl bg-white border border-brain-health-100 p-6 space-y-4">
          <section>
            <h2 className="font-semibold text-brain-health-900 mb-2">Patient summary</h2>
            <p className="text-sm text-brain-health-700">Alex · Bridge Stage 2 (Ward → Home)</p>
          </section>
          <section>
            <h2 className="font-semibold text-brain-health-900 mb-2">Current rhythm</h2>
            <p className="text-sm text-brain-health-700">Steady cognitive load (42%). 7-day capture streak. 1 active supporter.</p>
          </section>
          <section>
            <h2 className="font-semibold text-brain-health-900 mb-2">Life-readiness flags</h2>
            <ul className="text-sm text-brain-health-700 list-disc pl-5 space-y-1">
              <li>Morning routine: established</li>
              <li>Medication tracking: active</li>
              <li>Support circle: 1/3 (room to grow)</li>
            </ul>
          </section>
          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" /> Export PDF (demo)
          </Button>
          <p className="text-[10px] text-brain-health-400 text-center pt-2">
            This document supports — it does not diagnose, treat, or replace clinical judgement.
          </p>
        </div>
      </TierGate>
    </div>
  );
}

export default function LaunchClinicalBrief() {
  return (
    <LaunchLayout>
      <DemoModeProvider>
        <BriefBody />
      </DemoModeProvider>
    </LaunchLayout>
  );
}

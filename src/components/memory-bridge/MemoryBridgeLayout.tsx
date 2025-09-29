import React from 'react';
import { EmpoweredLayout } from '@/components/layout/EmpoweredLayout';
import { EmpoweringEmptyState } from '@/components/ui/EmpoweringEmptyState';
import { useAuth } from '@/hooks/useAuth';
import { AuthRequiredMessage } from '@/components/ui/AuthRequiredMessage';

interface MemoryBridgeLayoutProps {
  children: React.ReactNode;
  showEmptyState?: boolean;
  emptyStateType?: 'recordings' | 'actions' | 'schedule' | 'transcripts';
  onEmptyStateAction?: () => void;
}

export function MemoryBridgeLayout({
  children,
  showEmptyState = false,
  emptyStateType = 'recordings',
  onEmptyStateAction
}: MemoryBridgeLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <AuthRequiredMessage
        title="Sign in to access Memory Bridge"
        message="Your AI-powered memory assistant is ready to capture, transcribe, and extract actionable insights from your recordings."
        features={[
          "Voice-to-text transcription",
          "AI-powered action extraction",
          "Smart insight identification",
          "48-hour transcript access",
          "Seamless workflow integration"
        ]}
      />
    );
  }

  return (
    <EmpoweredLayout showOnboardingTips={true}>
      {showEmptyState ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <EmpoweringEmptyState
              type={emptyStateType}
              onAction={onEmptyStateAction}
            />
          </div>
        </div>
      ) : (
        children
      )}
    </EmpoweredLayout>
  );
}
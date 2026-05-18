import React from 'react';
import { User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSubject } from './SubjectContext';

export function SubjectSwitch({ className }: { className?: string }) {
  const { subject, supportedName, setSubject } = useSubject();

  const base = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors';
  const active = 'bg-white text-brain-health-900 shadow-sm';
  const inactive = 'text-brain-health-600 hover:text-brain-health-800';

  const truncatedName = supportedName.length > 18 ? `${supportedName.slice(0, 16)}…` : supportedName;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-full bg-brain-health-50 border border-brain-health-100',
        className
      )}
      role="tablist"
      aria-label="Caregiver view"
    >
      <button
        type="button"
        role="tab"
        aria-selected={subject === 'self'}
        onClick={() => setSubject('self')}
        className={cn(base, subject === 'self' ? active : inactive)}
      >
        <User className="h-3.5 w-3.5" strokeWidth={1.75} />
        Self
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={subject === 'supporting'}
        onClick={() => setSubject('supporting')}
        className={cn(base, subject === 'supporting' ? active : inactive)}
        title={`Supporting ${supportedName}`}
      >
        <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
        Supporting {truncatedName}
      </button>
    </div>
  );
}

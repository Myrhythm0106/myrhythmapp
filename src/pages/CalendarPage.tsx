import React from 'react';
import { TBICalendarApp } from '@/components/calendar-tbi/TBICalendarApp';
import { MVPThemeWrapper } from '@/components/theme/MVPThemeWrapper';
import { MVPTopNav } from '@/components/mvp/MVPTopNav';

export default function CalendarPage() {
  return (
    <MVPThemeWrapper>
      <MVPTopNav />
      <div className="min-h-screen bg-gradient-to-br from-clarity-teal-50 via-white to-neural-blue-50">
        <TBICalendarApp />
      </div>
    </MVPThemeWrapper>
  );
}
import React from 'react';

interface UnifiedHeaderProps {
  viewTitle: string;
  dateInfo: string;
}

export function UnifiedHeader({ viewTitle, dateInfo }: UnifiedHeaderProps) {
  return (
    <div className="text-center mb-6 space-y-2">
      <h1 className="text-2xl font-bold text-primary mb-2">
        Today, I choose...
      </h1>
      <h2 className="text-lg font-semibold text-muted-foreground">
        {viewTitle}
      </h2>
      <p className="text-sm text-muted-foreground">
        {dateInfo}
      </p>
    </div>
  );
}
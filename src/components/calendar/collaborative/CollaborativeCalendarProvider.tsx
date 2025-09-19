import React, { createContext, useContext } from 'react';
import { useCollaborativeCalendar } from './useCollaborativeCalendar';

interface CollaborativeCalendarContextType {
  shares: any[];
  invitations: any[];
  reminders: any[];
  loading: boolean;
  shareCalendarEvent: (eventId: string, email: string, permission: 'view' | 'edit' | 'admin') => Promise<void>;
  sendEventInvitation: (eventId: string, inviteeEmail: string, inviteeName?: string, message?: string) => Promise<void>;
  respondToInvitation: (invitationId: string, status: 'accepted' | 'declined' | 'maybe', message?: string) => Promise<void>;
  addEventReminders: (eventId: string, reminderTimes: string[]) => Promise<void>;
  refreshData: () => Promise<void>;
}

const CollaborativeCalendarContext = createContext<CollaborativeCalendarContextType | undefined>(undefined);

export function CollaborativeCalendarProvider({ children }: { children: React.ReactNode }) {
  const collaborativeData = useCollaborativeCalendar();

  return (
    <CollaborativeCalendarContext.Provider value={collaborativeData}>
      {children}
    </CollaborativeCalendarContext.Provider>
  );
}

export function useCollaborativeCalendarContext() {
  const context = useContext(CollaborativeCalendarContext);
  if (context === undefined) {
    throw new Error('useCollaborativeCalendarContext must be used within a CollaborativeCalendarProvider');
  }
  return context;
}
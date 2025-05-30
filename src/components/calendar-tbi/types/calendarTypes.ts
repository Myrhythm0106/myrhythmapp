
export type UserRole = 'individual' | 'caregiver' | 'clinician';

export type EventType = 'appointment' | 'therapy' | 'medication' | 'rest' | 'personal' | 'emergency';

export type EventStatus = 'upcoming' | 'current' | 'completed' | 'missed';

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface TBIEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: EventType;
  status: EventStatus;
  location?: string;
  description?: string;
  caregiverNotes?: string;
  reminderMinutes?: number;
  contactPerson?: string;
  contactPhone?: string;
  completedAt?: Date;
  energyRequired?: EnergyLevel;
}

export interface DayData {
  date: Date;
  events: TBIEvent[];
  energyLevel?: EnergyLevel;
  notes?: string;
  overallMood?: 'good' | 'okay' | 'difficult';
}

export interface CalendarSettings {
  userRole: UserRole;
  reminderDefaults: {
    visual: boolean;
    auditory: boolean;
    haptic: boolean;
    minutesBefore: number;
  };
  colorScheme: {
    appointment: string;
    therapy: string;
    medication: string;
    rest: string;
    personal: string;
    emergency: string;
  };
  showCompletedTasks: boolean;
  largeText: boolean;
}

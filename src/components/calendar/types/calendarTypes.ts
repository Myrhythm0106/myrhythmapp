
export interface RichMedia {
  type: "image" | "audio" | "video";
  url: string;
  caption?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  type: "appointment" | "therapy" | "medication" | "activity" | "personal" | "other" | "goal";
  watchers?: string[];
  media?: RichMedia[];
  description?: string;
  isGoal?: boolean;
  goalId?: string;
}

// Sample events data for development
export const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Neurology Appointment",
    date: "2023-05-20",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    location: "Dallas Neuro Center",
    type: "appointment",
    watchers: ["Dr. Smith"],
    media: [
      { 
        type: "image", 
        url: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
        caption: "Dr. Johnson's office"
      }
    ],
    description: "Annual checkup with neurologist"
  },
  {
    id: "2",
    title: "Cognitive Therapy",
    date: "2023-05-20",
    startTime: "2:30 PM",
    endTime: "3:30 PM",
    location: "Healing Minds Clinic",
    type: "therapy",
    media: [
      { 
        type: "image", 
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        caption: "Therapy room"
      },
      {
        type: "audio",
        url: "/sample-audio.mp3",
        caption: "Pre-session relaxation"
      }
    ],
    description: "Weekly cognitive behavioral therapy session"
  },
  {
    id: "3",
    title: "Support Group Meeting",
    date: "2023-05-20",
    startTime: "6:00 PM",
    endTime: "7:30 PM",
    location: "Community Center",
    type: "activity",
    watchers: ["Sarah", "Michael"],
    media: [
      {
        type: "video",
        url: "/sample-video.mp4",
        caption: "Directions to the community center"
      }
    ],
    description: "Monthly support group for TBI survivors"
  },
  {
    id: "4",
    title: "Improve Memory Skills",
    date: "2023-05-20",
    startTime: "All Day",
    type: "goal",
    description: "Practice memory exercises for 30 minutes daily",
    isGoal: true
  }
];

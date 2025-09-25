
import { Goal, Action } from "../types/goalTypes";

// Sample data
export const sampleGoals: Goal[] = [
  {
    id: "g1",
    title: "Improve memory skills",
    type: "weekly",
    description: "Practice memory exercises regularly to improve recall",
    progress: 60,
    dueDate: "2023-06-15",
    createdAt: "2023-05-01",
    smallSteps: []
  },
  {
    id: "g2",
    title: "Maintain regular therapy sessions",
    type: "monthly",
    description: "Attend all scheduled therapy sessions",
    progress: 75,
    dueDate: "2023-07-01",
    createdAt: "2023-05-05",
    smallSteps: []
  },
  {
    id: "g3",
    title: "Reduce anxiety levels",
    type: "long-term",
    description: "Use mindfulness techniques to manage stress and anxiety",
    progress: 40,
    createdAt: "2023-04-15",
    smallSteps: []
  }
];

export const sampleActions: Action[] = [
  {
    id: "a1",
    title: "Memory card game exercise",
    type: "activity",
    date: "2023-05-20",
    startTime: "10:00 AM",
    status: "done",
    goalId: "g1"
  },
  {
    id: "a2",
    title: "Cognitive therapy session",
    type: "therapy",
    date: "2023-05-22",
    startTime: "2:30 PM",
    endTime: "3:30 PM",
    status: "pending",
    goalId: "g2"
  },
  {
    id: "a3",
    title: "Brain training app exercises",
    type: "activity",
    date: "2023-05-25",
    startTime: "6:00 PM",
    status: "pending",
    goalId: "g1"
  },
  {
    id: "a4",
    title: "Group therapy session",
    type: "therapy",
    date: "2023-05-27",
    startTime: "11:15 AM",
    endTime: "12:30 PM",
    status: "doing",
    goalId: "g2"
  },
  {
    id: "a5",
    title: "Review memory flashcards",
    type: "personal",
    date: "2023-05-28",
    startTime: "09:00 AM",
    status: "pending",
    goalId: "g1"
  },
  {
    id: "a6",
    title: "Mindfulness meditation",
    type: "activity",
    date: "2023-05-26",
    startTime: "07:30 AM",
    status: "done",
    goalId: "g3"
  },
  {
    id: "a7",
    title: "Doctor appointment",
    type: "appointment",
    date: "2023-05-29",
    startTime: "3:00 PM",
    endTime: "4:00 PM",
    status: "pending"
  }
];

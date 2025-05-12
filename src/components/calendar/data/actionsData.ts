
import { Action } from "../ActionItem";

// Sample data
export const actions: Action[] = [
  {
    id: "1",
    title: "Neurology Appointment",
    date: "2023-05-20",
    time: "10:00 AM",
    location: "Dallas Neuro Center",
    type: "appointment",
    watchers: ["Dr. Smith"],
    linkedGoal: {
      id: "g1",
      title: "Follow medical plan",
      type: "health"
    }
  },
  {
    id: "2",
    title: "Cognitive Therapy",
    date: "2023-05-22",
    time: "2:30 PM",
    location: "Healing Minds Clinic",
    type: "therapy",
    linkedGoal: {
      id: "g2",
      title: "Improve memory skills",
      type: "cognitive"
    }
  },
  {
    id: "3",
    title: "Support Group Meeting",
    date: "2023-05-25",
    time: "6:00 PM",
    location: "Community Center",
    type: "activity",
    watchers: ["Sarah", "Michael"]
  },
  {
    id: "4",
    title: "Physical Therapy",
    date: "2023-05-27",
    time: "11:15 AM",
    location: "RehabWorks",
    type: "therapy",
    linkedGoal: {
      id: "g3",
      title: "Walk for 15 mins daily",
      type: "mobility"
    }
  },
];


import * as z from "zod";

const mediaItemSchema = z.object({
  type: z.enum(["image", "audio", "video"]),
  url: z.string().min(1, "Media URL is required"),
  caption: z.string().optional(),
});

export const actionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Action type is required"),
  date: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  duration: z.number().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  reminders: z.string(),
  watchers: z.array(z.string()).optional(),
  mediaAttachments: z.array(mediaItemSchema).optional(),
  description: z.string().optional(),
  isGoal: z.boolean().optional().default(false),
  goalId: z.string().optional(),
  progress: z.number().optional().default(0),
  status: z.enum(["completed", "pending", "in-progress", "canceled"]).optional().default("pending"),
  customReason: z.string().optional(),
  // Enhanced break and family time fields
  breakType: z.enum(["solo", "family", "movement", "mindful"]).optional(),
  familyMembers: z.array(z.string()).optional(),
  breakQuality: z.enum(["refreshing", "okay", "not-helpful"]).optional(),
  // Celebration-specific fields
  celebrantName: z.string().optional(),
  celebrantAge: z.number().optional(),
  relationshipYears: z.number().optional(),
  giftIdeas: z.string().optional(),
  celebrationNotes: z.string().optional(),
  isRecurringCelebration: z.boolean().optional().default(false),
  // Recurrence fields
  recurrencePattern: z.enum(["none", "daily", "weekly", "monthly", "yearly"]).default("none"),
  recurrenceInterval: z.number().min(1).max(365).default(1),
  recurrenceEndDate: z.string().optional(),
  recurrenceCount: z.number().optional(),
  recurrenceDaysOfWeek: z.array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])).optional(),
});

export type ActionFormValues = z.infer<typeof actionFormSchema>;

export const defaultActionValues: ActionFormValues = {
  title: "",
  type: "daily_win",
  date: new Date().toISOString().split('T')[0],
  startTime: "",
  endDate: "",
  endTime: "",
  duration: undefined,
  location: "",
  notes: "",
  reminders: "30min",
  watchers: [],
  mediaAttachments: [],
  description: "",
  isGoal: false,
  goalId: "none",
  progress: 0,
  status: "pending",
  customReason: "",
  breakType: undefined,
  familyMembers: [],
  breakQuality: undefined,
  celebrantName: "",
  celebrantAge: undefined,
  relationshipYears: undefined,
  giftIdeas: "",
  celebrationNotes: "",
  isRecurringCelebration: false,
  recurrencePattern: "none",
  recurrenceInterval: 1,
  recurrenceEndDate: "",
  recurrenceCount: undefined,
  recurrenceDaysOfWeek: [],
};

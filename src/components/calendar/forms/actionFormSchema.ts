
import * as z from "zod";

const mediaItemSchema = z.object({
  type: z.enum(["image", "audio", "video"]),
  url: z.string().min(1, "Media URL is required"),
  caption: z.string().optional(),
});

export const actionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Action type is required"), // Changed from actionType to type
  date: z.string().min(1, "Start date is required"), // Changed from startDate to date
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  duration: z.number().optional(), // Added duration field
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
});

export type ActionFormValues = z.infer<typeof actionFormSchema>;

export const defaultActionValues: ActionFormValues = {
  title: "",
  type: "daily_win", // Changed from actionType to type
  date: new Date().toISOString().split('T')[0], // Changed from startDate to date
  startTime: "",
  endDate: "",
  endTime: "",
  duration: undefined, // Added duration field
  location: "",
  notes: "",
  reminders: "30min",
  watchers: [],
  mediaAttachments: [],
  description: "",
  isGoal: false,
  goalId: "none",
  progress: 0,
  status: "pending"
};


import * as z from "zod";

const mediaItemSchema = z.object({
  type: z.enum(["image", "audio", "video"]),
  url: z.string().min(1, "Media URL is required"),
  caption: z.string().optional(),
});

export const actionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  actionType: z.string().min(1, "Action type is required"),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  reminders: z.string(),
  watchers: z.array(z.string()).optional(),
  mediaAttachments: z.array(mediaItemSchema).optional(),
  description: z.string().optional(),
});

export type ActionFormValues = z.infer<typeof actionFormSchema>;

export const defaultActionValues: ActionFormValues = {
  title: "",
  actionType: "",
  startDate: new Date().toISOString().split('T')[0],
  startTime: "",
  endDate: "",
  endTime: "",
  location: "",
  notes: "",
  reminders: "30min",
  watchers: [],
  mediaAttachments: [],
  description: "",
};

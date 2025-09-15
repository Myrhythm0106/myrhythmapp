
import * as z from "zod";

// Base schema for freemium users (no password required)
export const personalInfoBaseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  age: z.string().optional(),
  isFreemium: z.boolean().default(true),
});

// Extended schema for premium users (password required)
export const personalInfoPremiumSchema = personalInfoBaseSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  isFreemium: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Dynamic schema that switches based on user type
export const personalInfoSchema = z.union([personalInfoBaseSchema, personalInfoPremiumSchema]);

export type PersonalInfoFormValues = z.infer<typeof personalInfoBaseSchema> & {
  password?: string;
  confirmPassword?: string;
};

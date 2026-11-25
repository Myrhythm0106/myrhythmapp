import { z } from 'zod';

export const registrationSchema = z.object({
  name: z.string().trim().min(1, 'Please add your full name').max(100, 'Please use no more than 100 characters'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email'),
  password: z.string().min(8, 'Please use at least 8 characters'),
});

export function registrationError(message: string): string {
  if (/sending.*email|smtp|confirmation email/i.test(message)) {
    return "My account couldn't be created because the confirmation email couldn't be sent. My details stay here so I can try again.";
  }
  if (/rate limit|too many requests|security purposes/i.test(message)) {
    return 'Too many attempts just now. My details stay here. I can try again in a few minutes.';
  }
  return message || "My account couldn't be created. My details stay here so I can try again.";
}
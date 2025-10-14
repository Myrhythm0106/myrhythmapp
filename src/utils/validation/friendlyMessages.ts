/**
 * Friendly Validation Messages
 * 
 * Brain-health-friendly error messages that are supportive and clear.
 */

export const validationMessages = {
  email: {
    empty: "We'll need your email address to continue",
    invalid: "This email address looks incomplete",
    format: "Please check the format (example: you@email.com)",
    taken: "This email is already registered. Try logging in instead?",
  },
  
  password: {
    empty: "Please create a password to secure your account",
    tooShort: (min: number) => `Password needs at least ${min} characters for security`,
    tooWeak: "Try adding numbers or special characters to make it stronger",
    noMatch: "These passwords don't match. Please try again",
    requirements: "Password must be at least 8 characters with a mix of letters and numbers",
  },
  
  name: {
    empty: "What should we call you?",
    tooShort: "Your name seems a bit short. Please enter your full name",
    tooLong: (max: number) => `Name should be less than ${max} characters`,
    invalidCharacters: "Names can only contain letters, spaces, and hyphens",
  },
  
  phone: {
    empty: "We'll need a phone number to reach you",
    invalid: "This phone number doesn't look quite right",
    format: "Please use this format: (555) 123-4567",
  },
  
  date: {
    empty: "Please select a date",
    invalid: "This date doesn't look valid",
    future: "This date is in the future. Please choose a past date",
    past: "This date is in the past. Please choose a future date",
    tooOld: "This date seems too far in the past",
  },
  
  text: {
    empty: "This field is required",
    tooShort: (min: number) => `Please enter at least ${min} characters`,
    tooLong: (max: number) => `Please keep this under ${max} characters`,
  },
  
  number: {
    empty: "Please enter a number",
    invalid: "This should be a number",
    tooSmall: (min: number) => `Please enter a number of at least ${min}`,
    tooLarge: (max: number) => `Please enter a number less than ${max}`,
    notInteger: "Please enter a whole number (no decimals)",
  },
  
  url: {
    empty: "Please enter a website address",
    invalid: "This doesn't look like a valid website address",
    format: "Please include http:// or https:// at the start",
  },
  
  file: {
    empty: "Please select a file",
    tooLarge: (maxMB: number) => `File is too large. Please choose one under ${maxMB}MB`,
    wrongType: (types: string[]) => `Please upload one of these file types: ${types.join(', ')}`,
  },
  
  checkbox: {
    required: "Please check this box to continue",
    agreements: "Please accept the terms to proceed",
  },
  
  radio: {
    required: "Please select one of these options",
  },
  
  select: {
    required: "Please choose an option from the list",
  },
};

/**
 * Get a friendly error message based on validation rule
 */
export function getFriendlyMessage(
  field: keyof typeof validationMessages,
  rule: string,
  params?: any
): string {
  const fieldMessages = validationMessages[field] as any;
  
  if (!fieldMessages) {
    return "Please check this field";
  }
  
  const message = fieldMessages[rule];
  
  if (typeof message === 'function') {
    return message(params);
  }
  
  return message || "Please check this field";
}

/**
 * Brain-health specific encouragement messages
 */
export const encouragementMessages = {
  almostThere: "You're almost there! Just a couple more fields",
  goodProgress: "Great job! Your information is being saved",
  allSet: "Perfect! You're all set to continue",
  checking: "Just checking your information...",
  saved: "Your progress has been saved ✓",
};

export default validationMessages;

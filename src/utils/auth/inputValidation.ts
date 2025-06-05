
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizeName = (name: string): string => {
  return name.trim().replace(/[<>"'&]/g, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateNameLength = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50;
};

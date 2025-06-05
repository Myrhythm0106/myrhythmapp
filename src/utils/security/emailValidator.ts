
export class EmailValidator {
  static isValidEmail(email: string): boolean {
    if (!email || email.length > 254) return false;
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    // Check for valid format
    if (!emailRegex.test(email)) return false;
    
    // Additional security checks
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const [localPart, domain] = parts;
    
    // Check local part length
    if (localPart.length > 64) return false;
    
    // Check for dangerous patterns
    if (localPart.includes('..') || localPart.startsWith('.') || localPart.endsWith('.')) {
      return false;
    }
    
    return true;
  }
}

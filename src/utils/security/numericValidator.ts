
import { toast } from "sonner";

export class NumericValidator {
  static validateNumericRange(value: number, min: number, max: number, fieldName: string): boolean {
    if (isNaN(value) || !isFinite(value)) {
      toast.error(`${fieldName} must be a valid number`);
      return false;
    }
    
    if (value < min || value > max) {
      toast.error(`${fieldName} must be between ${min} and ${max}`);
      return false;
    }
    
    return true;
  }

  static validateDate(dateString: string, fieldName: string = "Date"): boolean {
    if (!dateString || typeof dateString !== 'string') {
      toast.error(`${fieldName} is required`);
      return false;
    }
    
    // Check for SQL injection in date string
    if (/[';"]|union|select|insert|update|delete|drop/i.test(dateString)) {
      toast.error(`${fieldName} contains invalid characters`);
      return false;
    }
    
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      toast.error(`${fieldName} format is invalid`);
      return false;
    }
    
    // Security: Prevent extremely old or future dates
    const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    const tenYearsFromNow = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());
    
    if (date < hundredYearsAgo || date > tenYearsFromNow) {
      toast.error(`${fieldName} must be within a reasonable range (last 100 years to next 10 years)`);
      return false;
    }
    
    return true;
  }
}

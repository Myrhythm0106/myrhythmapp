
import { HtmlSanitizer } from "./htmlSanitizer";
import { EmailValidator } from "./emailValidator";
import { PasswordValidator } from "./passwordValidator";
import { RateLimiter } from "./rateLimiter";
import { FileValidator } from "./fileValidator";
import { UrlValidator } from "./urlValidator";
import { NumericValidator } from "./numericValidator";

export class InputValidator {
  // HTML sanitization
  static sanitizeHtml = HtmlSanitizer.sanitizeHtml;
  static sanitizeText = HtmlSanitizer.sanitizeText;

  // Email validation
  static isValidEmail = EmailValidator.isValidEmail;

  // Password validation
  static validatePassword = PasswordValidator.validatePassword;

  // Rate limiting
  static checkRateLimit = RateLimiter.checkRateLimit;

  // File validation
  static validateFileUpload = FileValidator.validateFileUpload;

  // URL validation
  static validateUrl = UrlValidator.validateUrl;

  // Numeric validation
  static validateNumericRange = NumericValidator.validateNumericRange;
  static validateDate = NumericValidator.validateDate;
}

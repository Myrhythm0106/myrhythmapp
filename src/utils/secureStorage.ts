
import { supabase } from "@/integrations/supabase/client";

// Secure storage utility that minimizes localStorage usage
export class SecureStorage {
  private static readonly SENSITIVE_KEYS = [
    'payment_info',
    'personal_data',
    'auth_tokens',
    'user_credentials'
  ];

  // Check if a key contains sensitive data
  private static isSensitive(key: string): boolean {
    return this.SENSITIVE_KEYS.some(sensitiveKey => 
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );
  }

  // Secure set - encrypts sensitive data and warns about usage
  static setItem(key: string, value: string): void {
    if (this.isSensitive(key)) {
      console.warn(`⚠️ Storing sensitive data in localStorage: ${key}. Consider server-side storage.`);
      // For sensitive data, we could encrypt it here
      // For now, we'll just warn and store temporarily
      const encrypted = btoa(value); // Basic encoding - not real encryption
      localStorage.setItem(`secure_${key}`, encrypted);
    } else {
      localStorage.setItem(key, value);
    }
  }

  // Secure get - decrypts sensitive data
  static getItem(key: string): string | null {
    if (this.isSensitive(key)) {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (encrypted) {
        try {
          return atob(encrypted); // Basic decoding
        } catch (error) {
          console.error('Failed to decrypt stored data:', error);
          return null;
        }
      }
      return null;
    }
    return localStorage.getItem(key);
  }

  // Remove item securely
  static removeItem(key: string): void {
    if (this.isSensitive(key)) {
      localStorage.removeItem(`secure_${key}`);
    }
    localStorage.removeItem(key);
  }

  // Clear all sensitive data (call on logout)
  static clearSensitiveData(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_') || this.isSensitive(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Clear all data
  static clearAll(): void {
    localStorage.clear();
  }

  // Check for sensitive data in localStorage
  static auditStorage(): { sensitiveDatatFound: boolean; keys: string[] } {
    const keys = Object.keys(localStorage);
    const sensitiveKeys = keys.filter(key => this.isSensitive(key) || key.startsWith('secure_'));
    
    return {
      sensitiveDatatFound: sensitiveKeys.length > 0,
      keys: sensitiveKeys
    };
  }
}


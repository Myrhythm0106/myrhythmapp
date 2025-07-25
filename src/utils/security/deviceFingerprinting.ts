import { SecureLogger } from '@/utils/security/secureLogger';

interface DeviceInfo {
  userAgent: string;
  screen: string;
  timezone: string;
  language: string;
  platform: string;
}

export class DeviceFingerprinting {
  private static getDeviceInfo(): DeviceInfo {
    return {
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform
    };
  }

  static generateFingerprint(): string {
    const deviceInfo = this.getDeviceInfo();
    const fingerprint = btoa(JSON.stringify(deviceInfo));
    return fingerprint.substring(0, 32); // Truncate for storage
  }

  static async detectSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      const currentFingerprint = this.generateFingerprint();
      const storedFingerprint = localStorage.getItem(`device_${userId}`);
      
      if (!storedFingerprint) {
        // First time user, store fingerprint
        localStorage.setItem(`device_${userId}`, currentFingerprint);
        SecureLogger.info('New device registered', { userId, fingerprint: currentFingerprint.substring(0, 8) + '...' });
        return false;
      }
      
      if (storedFingerprint !== currentFingerprint) {
        SecureLogger.critical('Suspicious activity: Device fingerprint mismatch', {
          userId,
          stored: storedFingerprint.substring(0, 8) + '...',
          current: currentFingerprint.substring(0, 8) + '...'
        });
        return true;
      }
      
      return false;
    } catch (error) {
      SecureLogger.error('Device fingerprinting failed', error, userId);
      return false;
    }
  }

  static clearDeviceFingerprint(userId: string): void {
    localStorage.removeItem(`device_${userId}`);
    SecureLogger.info('Device fingerprint cleared', { userId });
  }
}
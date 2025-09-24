interface MFAVerificationResult {
  success: boolean;
  message: string;
  remainingAttempts?: number;
}

export class MockMFAVerification {
  private static failureCount = new Map<string, number>();

  static async verifyTOTP(code: string, userId: string): Promise<MFAVerificationResult> {
    console.log('🔐 [MOCK] TOTP Verification for user:', userId, 'code:', code);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Accept any 6-digit code as valid
    if (code.length === 6 && /^\d+$/.test(code)) {
      this.failureCount.delete(`${userId}-totp`);
      console.log('✅ [MOCK] TOTP verification successful');
      return {
        success: true,
        message: 'TOTP verification successful'
      };
    }

    // Track failures for realistic rate limiting demo
    const key = `${userId}-totp`;
    const failures = (this.failureCount.get(key) || 0) + 1;
    this.failureCount.set(key, failures);

    const remainingAttempts = Math.max(0, 3 - failures);
    
    console.log('❌ [MOCK] TOTP verification failed');
    return {
      success: false,
      message: 'Invalid TOTP code',
      remainingAttempts
    };
  }

  static async verifySMS(code: string, userId: string): Promise<MFAVerificationResult> {
    console.log('📱 [MOCK] SMS Verification for user:', userId, 'code:', code);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 700));

    // Accept any 6-digit code as valid
    if (code.length === 6 && /^\d+$/.test(code)) {
      this.failureCount.delete(`${userId}-sms`);
      console.log('✅ [MOCK] SMS verification successful');
      return {
        success: true,
        message: 'SMS verification successful'
      };
    }

    const key = `${userId}-sms`;
    const failures = (this.failureCount.get(key) || 0) + 1;
    this.failureCount.set(key, failures);

    const remainingAttempts = Math.max(0, 3 - failures);
    
    console.log('❌ [MOCK] SMS verification failed');
    return {
      success: false,
      message: 'Invalid SMS code',
      remainingAttempts
    };
  }

  static async verifyBackupCode(code: string, userId: string): Promise<MFAVerificationResult> {
    console.log('🔑 [MOCK] Backup Code Verification for user:', userId);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Accept specific fake backup codes or any 8-character alphanumeric
    const validFakeCodes = [
      'ABC12345', 'DEF67890', 'GHI24680', 'JKL13579', 'MNO97531',
      'PQR86420', 'STU11111', 'VWX22222', 'YZ123456', 'AB987654'
    ];

    const isValidFormat = /^[A-Z0-9]{8}$/.test(code.toUpperCase());
    const isValidFakeCode = validFakeCodes.includes(code.toUpperCase());

    if (isValidFormat || isValidFakeCode) {
      console.log('✅ [MOCK] Backup code verification successful');
      return {
        success: true,
        message: 'Backup code verified successfully'
      };
    }

    console.log('❌ [MOCK] Backup code verification failed');
    return {
      success: false,
      message: 'Invalid backup code'
    };
  }

  private static async checkRateLimit(userId: string, factorType: string): Promise<MFAVerificationResult> {
    const key = `${userId}-${factorType}`;
    const failures = this.failureCount.get(key) || 0;
    
    if (failures >= 3) {
      console.log('🚫 [MOCK] Rate limit exceeded for user:', userId, 'factor:', factorType);
      return {
        success: false,
        message: 'Too many failed attempts. Please try again later.',
        remainingAttempts: 0
      };
    }

    return { success: true, message: 'Rate limit check passed' };
  }

  private static async logVerificationAttempt(userId: string, factorType: string, success: boolean): Promise<void> {
    console.log('📊 [MOCK] MFA verification attempt logged:', {
      userId,
      factorType,
      success,
      timestamp: new Date().toISOString()
    });
  }

  private static async getRemainingAttempts(userId: string, factorType: string): Promise<number> {
    const key = `${userId}-${factorType}`;
    const failures = this.failureCount.get(key) || 0;
    return Math.max(0, 3 - failures);
  }
}
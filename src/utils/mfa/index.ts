// Conditional exports based on environment variable
const isMockMode = import.meta.env.VITE_MOCK_SECURITY === 'true';

// Factory function to avoid top-level await
export const createMFAVerification = async () => {
  if (isMockMode) {
    const { MockMFAVerification } = await import('./mockMFAVerification');
    return new MockMFAVerification();
  } else {
    const { RealMFAVerification } = await import('./realMFAVerification');
    return new RealMFAVerification();
  }
};

// For backwards compatibility - lazy initialization
let mfaVerificationInstance: any = null;

export const MFAVerification = {
  getInstance: async () => {
    if (!mfaVerificationInstance) {
      mfaVerificationInstance = await createMFAVerification();
    }
    return mfaVerificationInstance;
  }
};
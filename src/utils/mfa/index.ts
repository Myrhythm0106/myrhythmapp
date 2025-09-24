// Conditional exports based on environment variable
const isMockMode = import.meta.env.VITE_MOCK_SECURITY === 'true';

export const MFAVerification = isMockMode 
  ? (await import('./mockMFAVerification')).MockMFAVerification
  : (await import('./realMFAVerification')).RealMFAVerification;
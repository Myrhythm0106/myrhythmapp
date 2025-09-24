// Conditional exports based on environment variable
const isMockMode = import.meta.env.VITE_MOCK_SECURITY === 'true';

export const SecurityIncidentHandler = isMockMode 
  ? (await import('./mockSecurityIncidentHandler')).MockSecurityIncidentHandler
  : (await import('./securityIncidentHandler')).SecurityIncidentHandler;

export const SecureLogger = isMockMode
  ? (await import('./mockSecureLogger')).MockSecureLogger  
  : (await import('./secureLogger')).SecureLogger;
// Conditional exports based on environment variable
const isMockMode = import.meta.env.VITE_MOCK_SECURITY === 'true';

// Factory functions to avoid top-level await
export const createSecurityIncidentHandler = async () => {
  if (isMockMode) {
    const { MockSecurityIncidentHandler } = await import('./mockSecurityIncidentHandler');
    return new MockSecurityIncidentHandler();
  } else {
    const { SecurityIncidentHandler } = await import('./securityIncidentHandler');
    return new SecurityIncidentHandler();
  }
};

export const createSecureLogger = async () => {
  if (isMockMode) {
    const { MockSecureLogger } = await import('./mockSecureLogger');
    return new MockSecureLogger();
  } else {
    const { SecureLogger } = await import('./secureLogger');
    return new SecureLogger();
  }
};

// For backwards compatibility - lazy initialization
let securityIncidentHandlerInstance: any = null;
let secureLoggerInstance: any = null;

export const SecurityIncidentHandler = {
  getInstance: async () => {
    if (!securityIncidentHandlerInstance) {
      securityIncidentHandlerInstance = await createSecurityIncidentHandler();
    }
    return securityIncidentHandlerInstance;
  }
};

export const SecureLogger = {
  getInstance: async () => {
    if (!secureLoggerInstance) {
      secureLoggerInstance = await createSecureLogger();
    }
    return secureLoggerInstance;
  }
};
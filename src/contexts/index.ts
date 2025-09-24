// Conditional exports based on environment variable
const isMockMode = import.meta.env.VITE_MOCK_SECURITY === 'true';

// Factory function to avoid top-level await
export const createAuthProvider = async () => {
  if (isMockMode) {
    const { MockAuthProvider } = await import('./mockAuthContext');
    return MockAuthProvider;
  } else {
    const { AuthProvider } = await import('./AuthContext');
    return AuthProvider;
  }
};

export const createUseAuth = async () => {
  if (isMockMode) {
    const { useAuth } = await import('./mockAuthContext');
    return useAuth;
  } else {
    const { useAuth } = await import('./AuthContext');
    return useAuth;
  }
};

// For backwards compatibility - lazy initialization
let authProviderInstance: any = null;
let useAuthInstance: any = null;

export const AuthProvider = {
  getInstance: async () => {
    if (!authProviderInstance) {
      authProviderInstance = await createAuthProvider();
    }
    return authProviderInstance;
  }
};

export const useAuth = {
  getInstance: async () => {
    if (!useAuthInstance) {
      useAuthInstance = await createUseAuth();
    }
    return useAuthInstance;
  }
};
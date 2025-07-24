import { useState, useCallback, useEffect } from "react";

export interface UserPreferences {
  dateFormat: "dd/mm/yyyy" | "mm/dd/yyyy";
  timeFormat: "12h" | "24h";
  timezone: string;
}

const defaultPreferences: UserPreferences = {
  dateFormat: "dd/mm/yyyy",
  timeFormat: "12h",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user-preferences');
      return saved ? JSON.parse(saved) : defaultPreferences;
    }
    return defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('user-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  const formatDate = useCallback((date: Date) => {
    if (preferences.dateFormat === "mm/dd/yyyy") {
      return date.toLocaleDateString('en-US');
    } else {
      return date.toLocaleDateString('en-GB');
    }
  }, [preferences.dateFormat]);

  const formatTime = useCallback((date: Date) => {
    if (preferences.timeFormat === "24h") {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
  }, [preferences.timeFormat]);

  return {
    preferences,
    updatePreferences,
    formatDate,
    formatTime
  };
}
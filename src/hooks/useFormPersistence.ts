
import { useState, useEffect, useCallback } from 'react';

interface FormPersistenceOptions {
  key: string;
  enabled?: boolean;
  autoSave?: boolean;
  saveInterval?: number;
}

export function useFormPersistence<T>(
  initialData: T,
  options: FormPersistenceOptions
) {
  const { key, enabled = true, autoSave = true, saveInterval = 30000 } = options;
  const [data, setData] = useState<T>(initialData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load saved data on mount
  useEffect(() => {
    if (!enabled) return;
    
    const saved = localStorage.getItem(`form_data_${key}`);
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setData(parsedData);
        setLastSaved(new Date(localStorage.getItem(`form_saved_${key}`) || Date.now()));
      } catch (error) {
        console.warn('Failed to load saved form data:', error);
      }
    }
  }, [key, enabled]);

  // Save data to localStorage
  const saveData = useCallback(() => {
    if (!enabled) return;
    
    localStorage.setItem(`form_data_${key}`, JSON.stringify(data));
    localStorage.setItem(`form_saved_${key}`, new Date().toISOString());
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  }, [data, key, enabled]);

  // Update data and mark as unsaved
  const updateData = useCallback((newData: Partial<T>) => {
    setData(prev => ({ ...prev, ...newData }));
    setHasUnsavedChanges(true);
  }, []);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(`form_data_${key}`);
    localStorage.removeItem(`form_saved_${key}`);
    setHasUnsavedChanges(false);
    setLastSaved(null);
  }, [key]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges || !enabled) return;

    const interval = setInterval(saveData, saveInterval);
    return () => clearInterval(interval);
  }, [autoSave, hasUnsavedChanges, saveData, saveInterval, enabled]);

  return {
    data,
    updateData,
    saveData,
    clearSavedData,
    hasUnsavedChanges,
    lastSaved,
    hasSavedData: !!localStorage.getItem(`form_data_${key}`)
  };
}

import { useState, useCallback, useEffect } from "react";

interface TransferData {
  selectedDate?: Date;
  selectedTime?: string;
  goalType?: string;
  actionType?: string;
  location?: string;
  duration?: number;
  prefillData?: Record<string, any>;
}

// Global state for seamless data transfer between components
let globalTransferData: TransferData = {};
const listeners: Set<(data: TransferData) => void> = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener(globalTransferData));
};

export function useDataTransfer() {
  const [transferData, setTransferData] = useState<TransferData>(globalTransferData);

  useEffect(() => {
    const updateLocal = (data: TransferData) => setTransferData(data);
    listeners.add(updateLocal);
    return () => {
      listeners.delete(updateLocal);
    };
  }, []);

  const updateTransferData = useCallback((updates: Partial<TransferData>) => {
    globalTransferData = { ...globalTransferData, ...updates };
    notifyListeners();
  }, []);

  const clearTransferData = useCallback(() => {
    globalTransferData = {};
    notifyListeners();
  }, []);

  const prefillForm = useCallback((formType: 'action' | 'goal', baseData?: Record<string, any>) => {
    const prefillData: Record<string, any> = {
      date: transferData.selectedDate,
      time: transferData.selectedTime,
      ...baseData
    };

    if (formType === 'action') {
      prefillData.type = transferData.actionType || 'regular';
      prefillData.duration = transferData.duration || 30;
      prefillData.location = transferData.location || '';
    }

    if (formType === 'goal') {
      prefillData.category = transferData.goalType || 'personal';
      prefillData.target_date = transferData.selectedDate;
    }

    return prefillData;
  }, [transferData]);

  return {
    transferData,
    updateTransferData,
    clearTransferData,
    prefillForm
  };
}
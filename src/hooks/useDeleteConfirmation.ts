import { useState } from 'react';

interface DeleteItem {
  id: string;
  name: string;
  type: 'recording' | 'action' | 'meeting';
}

export function useDeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    item: DeleteItem;
    onConfirm: () => void;
  } | null>(null);

  const confirmDelete = (item: DeleteItem, onConfirm: () => void) => {
    setPendingDelete({ item, onConfirm });
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (pendingDelete) {
      pendingDelete.onConfirm();
      setPendingDelete(null);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setPendingDelete(null);
    setIsOpen(false);
  };

  const getDeleteTitle = () => {
    if (!pendingDelete) return '';
    const { type } = pendingDelete.item;
    
    switch (type) {
      case 'recording':
        return 'Delete Recording';
      case 'action':
        return 'Delete Action';
      case 'meeting':
        return 'Delete Meeting';
      default:
        return 'Delete Item';
    }
  };

  const getDeleteDescription = () => {
    if (!pendingDelete) return '';
    const { type, name } = pendingDelete.item;
    
    switch (type) {
      case 'recording':
        return `Are you sure you want to delete the recording "{itemName}"? This action cannot be undone and all associated data will be permanently removed.`;
      case 'action':
        return `Are you sure you want to delete the action "{itemName}"? This will remove it from your schedule and cannot be undone.`;
      case 'meeting':
        return `Are you sure you want to delete the meeting "{itemName}"? This will remove the meeting and all its extracted actions permanently.`;
      default:
        return `Are you sure you want to delete "{itemName}"? This action cannot be undone.`;
    }
  };

  return {
    isOpen,
    confirmDelete,
    handleConfirm,
    handleCancel,
    pendingDelete,
    title: getDeleteTitle(),
    description: getDeleteDescription(),
    itemName: pendingDelete?.item.name || ''
  };
}
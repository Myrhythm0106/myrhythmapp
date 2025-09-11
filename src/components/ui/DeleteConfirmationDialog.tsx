import React from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  itemName?: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  itemName
}: DeleteConfirmationDialogProps) {
  const formattedDescription = itemName 
    ? description.replace('{itemName}', `"${itemName}"`)
    : description;

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title={title}
      description={formattedDescription}
      confirmText="Delete"
      cancelText="Cancel"
      variant="destructive"
    />
  );
}
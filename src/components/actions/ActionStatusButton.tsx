import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  X,
  ChevronDown
} from 'lucide-react';
import { ActionStatus } from '@/hooks/useStatusManagement';
import { StatusUpdateDialog } from '@/components/status/StatusUpdateDialog';

interface ActionStatusButtonProps {
  actionId: string;
  actionTitle: string;
  currentStatus: ActionStatus;
  onStatusUpdated?: (newStatus: ActionStatus) => void;
  variant?: 'badge' | 'button';
  showDropdown?: boolean;
}

const statusConfig = {
  not_started: {
    label: 'Ready to Begin',
    icon: Clock,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    variant: 'secondary' as const
  },
  doing: {
    label: 'In My Flow',
    icon: Play,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    variant: 'default' as const
  },
  done: {
    label: 'Accomplished!',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    variant: 'default' as const
  },
  on_hold: {
    label: 'Paused Mindfully',
    icon: Pause,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    variant: 'outline' as const
  },
  cancelled: {
    label: 'Redirected Energy',
    icon: X,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    variant: 'destructive' as const
  }
};

export function ActionStatusButton({ 
  actionId, 
  actionTitle, 
  currentStatus, 
  onStatusUpdated,
  variant = 'button',
  showDropdown = true
}: ActionStatusButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const config = statusConfig[currentStatus];
  const Icon = config.icon;

  if (variant === 'badge') {
    return (
      <>
        <Badge 
          variant={config.variant}
          className={`cursor-pointer hover:opacity-80 ${config.color} ${showDropdown ? 'pr-6' : ''}`}
          onClick={() => showDropdown && setIsDialogOpen(true)}
        >
          <Icon className="w-3 h-3 mr-1" />
          {config.label}
          {showDropdown && <ChevronDown className="w-3 h-3 ml-1" />}
        </Badge>

        {showDropdown && (
          <StatusUpdateDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            actionId={actionId}
            actionTitle={actionTitle}
            currentStatus={currentStatus}
            onStatusUpdated={onStatusUpdated}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Button
        variant={config.variant}
        size="sm"
        className={`${config.color} ${showDropdown ? 'pr-8' : ''}`}
        onClick={() => showDropdown && setIsDialogOpen(true)}
      >
        <Icon className="w-4 h-4 mr-2" />
        {config.label}
        {showDropdown && <ChevronDown className="w-4 h-4 ml-2" />}
      </Button>

      {showDropdown && (
        <StatusUpdateDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          actionId={actionId}
          actionTitle={actionTitle}
          currentStatus={currentStatus}
          onStatusUpdated={onStatusUpdated}
        />
      )}
    </>
  );
}
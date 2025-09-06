import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Shield, 
  ShieldCheck, 
  Eye,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SupportCircleStatus {
  activeMembers: number;
  sharingEnabled: boolean;
  hasCalendarAccess: boolean;
  hasMemoryAccess: boolean;
}

export function SupportCircleAccessChip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<SupportCircleStatus>({
    activeMembers: 0,
    sharingEnabled: false,
    hasCalendarAccess: false,
    hasMemoryAccess: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupportCircleStatus = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get active support circle members
        const { data: members, error } = await supabase
          .from('support_circle_members')
          .select('permissions, can_receive_alerts')
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (error) throw error;

        const activeMembers = members?.length || 0;
        const sharingEnabled = members?.some(m => m.can_receive_alerts) || false;
        const hasCalendarAccess = members?.some(m => {
          const permissions = m.permissions as any;
          return permissions?.calendar === true;
        }) || false;
        const hasMemoryAccess = members?.some(m => {
          const permissions = m.permissions as any;
          return permissions?.memory === true;
        }) || false;

        setStatus({
          activeMembers,
          sharingEnabled,
          hasCalendarAccess,
          hasMemoryAccess
        });
      } catch (error) {
        console.error('Error fetching support circle status:', error);
        setStatus({ activeMembers: 0, sharingEnabled: false, hasCalendarAccess: false, hasMemoryAccess: false });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupportCircleStatus();
  }, [user]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-brain-health-100 rounded-full"></div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (status.activeMembers === 0) return 'bg-gray-100 text-gray-700 border-gray-200';
    if (status.sharingEnabled) return 'bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200';
    return 'bg-sunrise-amber-100 text-sunrise-amber-700 border-sunrise-amber-200';
  };

  const getStatusIcon = () => {
    if (status.activeMembers === 0) return Shield;
    if (status.sharingEnabled) return ShieldCheck;
    return Eye;
  };

  const StatusIcon = getStatusIcon();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`${getStatusColor()} hover:opacity-80 transition-all duration-200`}
        >
          <StatusIcon className="h-4 w-4 mr-2" />
          <span className="font-medium">
            {status.activeMembers === 0 ? 'Private' : 
             status.sharingEnabled ? `Sharing (${status.activeMembers})` : 
             `Circle (${status.activeMembers})`}
          </span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Support Circle</span>
            <Badge variant="outline" className="text-xs">
              {status.activeMembers} member{status.activeMembers !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          {status.activeMembers > 0 && (
            <div className="space-y-1 text-xs text-brain-health-600">
              {status.hasCalendarAccess && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-memory-emerald-400 rounded-full"></div>
                  Calendar access enabled
                </div>
              )}
              {status.hasMemoryAccess && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brain-health-400 rounded-full"></div>
                  Memory access enabled
                </div>
              )}
              {status.sharingEnabled && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sunrise-amber-400 rounded-full"></div>
                  Receiving updates
                </div>
              )}
            </div>
          )}
        </div>
        
        <DropdownMenuItem onClick={() => navigate('/support-circle')}>
          <Users className="h-4 w-4 mr-2" />
          Manage Support Circle
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Eye } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ShareableView from '@/components/traceability/ShareableView';

interface SharedAccess {
  id: string;
  user_id: string;
  view_type: 'full' | 'goals_only' | 'priorities_only';
  can_comment: boolean;
  userName: string;
}

const SharedTraceabilityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get('userId');
  
  const [sharedAccess, setSharedAccess] = useState<SharedAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccess, setSelectedAccess] = useState<SharedAccess | null>(null);

  useEffect(() => {
    if (user) {
      fetchSharedAccess();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUserId && sharedAccess.length > 0) {
      const access = sharedAccess.find(a => a.user_id === selectedUserId);
      if (access) {
        setSelectedAccess(access);
      }
    }
  }, [selectedUserId, sharedAccess]);

  const fetchSharedAccess = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      // Get all shared views where current user is a support circle member
      const { data: memberData } = await supabase
        .from('support_circle_members')
        .select('id, user_id')
        .eq('member_email', user.email)
        .eq('status', 'active');
      
      if (!memberData || memberData.length === 0) {
        setSharedAccess([]);
        setIsLoading(false);
        return;
      }

      const memberIds = memberData.map(m => m.id);
      
      // Get shared traceability views
      const { data: sharedViews } = await supabase
        .from('shared_traceability_views')
        .select('*')
        .in('support_circle_member_id', memberIds)
        .eq('is_active', true);
      
      if (!sharedViews || sharedViews.length === 0) {
        setSharedAccess([]);
        setIsLoading(false);
        return;
      }

      // Get user profiles for names
      const userIds = [...new Set(sharedViews.map(v => v.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p.name]) || []);
      
      const accessList: SharedAccess[] = sharedViews.map(view => ({
        id: view.id,
        user_id: view.user_id,
        view_type: view.view_type as 'full' | 'goals_only' | 'priorities_only',
        can_comment: view.can_comment,
        userName: profileMap.get(view.user_id) || 'User'
      }));
      
      setSharedAccess(accessList);
    } catch (error) {
      console.error('Error fetching shared access:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedAccess) {
    return (
      <PageLayout 
        title={`${selectedAccess.userName}'s Journey`}
        description="Shared goals and priorities"
      >
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => {
              setSelectedAccess(null);
              navigate('/shared-traceability');
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All
          </Button>
          
          <ShareableView
            userId={selectedAccess.user_id}
            viewType={selectedAccess.view_type}
            canComment={selectedAccess.can_comment}
            userName={selectedAccess.userName}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Shared With You" 
      description="View goals and priorities shared by people you support"
    >
      <div className="space-y-6">
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-pulse text-muted-foreground">Loading shared access...</div>
            </CardContent>
          </Card>
        ) : sharedAccess.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Shared Access Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                When people you support share their goals and priorities with you, 
                they'll appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sharedAccess.map(access => (
              <Card 
                key={access.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedAccess(access)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {access.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">{access.userName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {access.view_type === 'full' && 'Full View'}
                          {access.view_type === 'goals_only' && 'Goals Only'}
                          {access.view_type === 'priorities_only' && 'Priorities Only'}
                        </Badge>
                        {access.can_comment && (
                          <Badge variant="secondary" className="text-xs">
                            Can Comment
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SharedTraceabilityPage;

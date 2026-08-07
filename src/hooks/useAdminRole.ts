import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useAdminRole() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkVersion, setCheckVersion] = useState(0);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setError(null);
      setIsLoading(false);
      return;
    }

    const checkAdmin = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin',
        });
        if (error) throw error;
        setIsAdmin(!!data);
      } catch (roleError) {
        setIsAdmin(false);
        setError(roleError instanceof Error ? roleError.message : 'Unable to verify founder access');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user, checkVersion]);

  return {
    isAdmin,
    isLoading,
    error,
    retry: () => setCheckVersion((version) => version + 1),
  };
}

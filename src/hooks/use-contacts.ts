import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserContact {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
}

export function useContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<UserContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadContacts = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('user_contacts')
      .select('id, name, email, created_at')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (data) {
      setContacts(data as UserContact[]);
    }
    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const addContact = useCallback(async (email: string, name?: string) => {
    if (!user?.id) return null;
    
    // Check if already exists
    const existing = contacts.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;

    const { data, error } = await supabase
      .from('user_contacts')
      .insert({ user_id: user.id, email: email.toLowerCase(), name: name || null })
      .select('id, name, email, created_at')
      .single();

    if (data && !error) {
      const contact = data as UserContact;
      setContacts(prev => [...prev, contact]);
      return contact;
    }
    return null;
  }, [user?.id, contacts]);

  const removeContact = useCallback(async (contactId: string) => {
    if (!user?.id) return;
    await supabase.from('user_contacts').delete().eq('id', contactId).eq('user_id', user.id);
    setContacts(prev => prev.filter(c => c.id !== contactId));
  }, [user?.id]);

  const searchContacts = useCallback((query: string): UserContact[] => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return contacts.filter(c => 
      c.email.toLowerCase().includes(q) || 
      (c.name && c.name.toLowerCase().includes(q))
    );
  }, [contacts]);

  return { contacts, isLoading, addContact, removeContact, searchContacts, refetch: loadContacts };
}

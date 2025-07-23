import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface MemoryEntry {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  memory_type: 'text' | 'photo' | 'voice';
  file_path?: string;
  file_size_bytes?: number;
  created_at: string;
  updated_at: string;
  category: string;
  tags: string[];
  is_favorite: boolean;
  visibility_level: 'private' | 'watchers' | 'healthcare';
}

export interface MemoryComment {
  id: string;
  memory_id: string;
  commenter_email: string;
  commenter_name: string;
  comment: string;
  created_at: string;
}

export function useMemoryBank() {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMemories = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memory_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemories((data || []) as MemoryEntry[]);
    } catch (error) {
      console.error('Error fetching memories:', error);
      toast({
        title: "Error loading memories",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMemory = async (memory: Omit<MemoryEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('memory_entries')
        .insert([{
          ...memory,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setMemories(prev => [data as MemoryEntry, ...prev]);
      toast({
        title: "Memory saved",
        description: "Your memory has been safely stored.",
      });

      return data;
    } catch (error) {
      console.error('Error creating memory:', error);
      toast({
        title: "Error saving memory",
        description: "Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateMemory = async (id: string, updates: Partial<MemoryEntry>) => {
    try {
      const { data, error } = await supabase
        .from('memory_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setMemories(prev => prev.map(memory => 
        memory.id === id ? { ...memory, ...data } as MemoryEntry : memory
      ));

      return data;
    } catch (error) {
      console.error('Error updating memory:', error);
      toast({
        title: "Error updating memory",
        description: "Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memory_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMemories(prev => prev.filter(memory => memory.id !== id));
      toast({
        title: "Memory deleted",
        description: "The memory has been removed.",
      });
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast({
        title: "Error deleting memory",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const uploadFile = async (file: File, memoryId: string) => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${memoryId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('memory-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      return fileName;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: "Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const getFileUrl = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('memory-files')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [user]);

  return {
    memories,
    loading,
    createMemory,
    updateMemory,
    deleteMemory,
    uploadFile,
    getFileUrl,
    refetch: fetchMemories,
  };
}
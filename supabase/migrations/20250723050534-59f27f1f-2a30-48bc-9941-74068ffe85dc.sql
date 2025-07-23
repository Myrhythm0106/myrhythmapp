
-- Create memory_entries table for storing memories
CREATE TABLE public.memory_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  memory_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'photo', 'voice'
  file_path TEXT,
  file_size_bytes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  visibility_level TEXT NOT NULL DEFAULT 'private' -- 'private', 'watchers', 'healthcare'
);

-- Create memory_comments table for watcher collaboration
CREATE TABLE public.memory_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id UUID REFERENCES public.memory_entries(id) ON DELETE CASCADE NOT NULL,
  commenter_email TEXT NOT NULL,
  commenter_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memory_watchers table for granular permissions
CREATE TABLE public.memory_watchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id UUID REFERENCES public.memory_entries(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  watcher_email TEXT NOT NULL,
  can_view BOOLEAN DEFAULT true,
  can_comment BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(memory_id, watcher_email)
);

-- Enable RLS on all tables
ALTER TABLE public.memory_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_watchers ENABLE ROW LEVEL SECURITY;

-- RLS policies for memory_entries
CREATE POLICY "Users can view their own memories"
  ON public.memory_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memories"
  ON public.memory_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories"
  ON public.memory_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories"
  ON public.memory_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Policy for watchers to view memories they have permission for
CREATE POLICY "Watchers can view shared memories"
  ON public.memory_entries FOR SELECT
  USING (
    visibility_level IN ('watchers', 'healthcare') AND
    EXISTS (
      SELECT 1 FROM public.memory_watchers mw
      WHERE mw.memory_id = memory_entries.id
      AND mw.watcher_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mw.can_view = true
    )
  );

-- RLS policies for memory_comments
CREATE POLICY "Users can view comments on their memories"
  ON public.memory_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memory_entries me
      WHERE me.id = memory_comments.memory_id
      AND me.user_id = auth.uid()
    )
  );

CREATE POLICY "Watchers can view comments on memories they can access"
  ON public.memory_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memory_watchers mw
      JOIN public.memory_entries me ON me.id = mw.memory_id
      WHERE mw.memory_id = memory_comments.memory_id
      AND mw.watcher_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mw.can_view = true
    )
  );

CREATE POLICY "Watchers can create comments on memories they have permission for"
  ON public.memory_comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memory_watchers mw
      WHERE mw.memory_id = memory_comments.memory_id
      AND mw.watcher_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mw.can_comment = true
    )
  );

-- RLS policies for memory_watchers
CREATE POLICY "Users can manage watchers for their memories"
  ON public.memory_watchers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.memory_entries me
      WHERE me.id = memory_watchers.memory_id
      AND me.user_id = auth.uid()
    )
  );

-- Create storage bucket for memory files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memory-files', 'memory-files', false);

-- Storage policies for memory files
CREATE POLICY "Users can upload their own memory files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'memory-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own memory files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'memory-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own memory files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'memory-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Watchers can access memory files they have permission for
CREATE POLICY "Watchers can access shared memory files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'memory-files' AND
    EXISTS (
      SELECT 1 FROM public.memory_watchers mw
      JOIN public.memory_entries me ON me.id = mw.memory_id
      WHERE mw.watcher_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mw.can_view = true
      AND me.file_path = name
    )
  );

-- Create cross_device_notifications table for watch/phone/iPad/laptop sync
CREATE TABLE public.cross_device_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  device_source TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '24 hours')
);

-- Enable Row Level Security
ALTER TABLE public.cross_device_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own notifications" 
ON public.cross_device_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notifications" 
ON public.cross_device_notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.cross_device_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX idx_cross_device_notifications_user_id ON public.cross_device_notifications(user_id);
CREATE INDEX idx_cross_device_notifications_created_at ON public.cross_device_notifications(created_at DESC);
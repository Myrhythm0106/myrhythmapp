
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS founding_comped boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS founding_member boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_uuid uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  sub_record RECORD;
  is_comped BOOLEAN;
BEGIN
  SELECT founding_comped INTO is_comped FROM public.profiles WHERE id = user_uuid;
  IF is_comped THEN
    RETURN 'founding_comped';
  END IF;

  SELECT * INTO sub_record
  FROM public.subscriptions
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN 'no_subscription';
  END IF;

  IF sub_record.status = 'trial' AND sub_record.trial_end >= CURRENT_DATE THEN
    RETURN 'trial_active';
  END IF;

  IF sub_record.status = 'trial' AND sub_record.trial_end < CURRENT_DATE THEN
    RETURN 'trial_expired';
  END IF;

  RETURN sub_record.status;
END;
$function$;

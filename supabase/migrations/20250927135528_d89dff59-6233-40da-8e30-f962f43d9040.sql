-- Clean up all annabelaaron email accounts and associated data (comprehensive version)
-- Handle all foreign key constraints
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Delete all data associated with annabelaaron email accounts
    FOR user_record IN 
        SELECT id FROM auth.users WHERE email LIKE '%annabelaaron%'
    LOOP
        -- Clean up ALL user-related data in order of dependencies
        -- Start with tables that have foreign keys to other user tables
        DELETE FROM user_onboarding_progress WHERE user_id = user_record.id;
        DELETE FROM memory_watchers WHERE user_id = user_record.id;
        DELETE FROM memory_comments WHERE memory_id IN (SELECT id FROM memory_entries WHERE user_id = user_record.id);
        DELETE FROM action_confirmations WHERE user_id = user_record.id;
        DELETE FROM calendar_shares WHERE creator_id = user_record.id;
        DELETE FROM event_invitations WHERE inviter_id = user_record.id;
        DELETE FROM event_reminders WHERE user_id = user_record.id;
        DELETE FROM cross_device_notifications WHERE user_id = user_record.id;
        DELETE FROM conversation_contexts WHERE user_id = user_record.id;
        DELETE FROM memory_bridge_comments WHERE user_id = user_record.id;
        DELETE FROM mfa_factors WHERE user_id = user_record.id;
        DELETE FROM mfa_verification_attempts WHERE user_id = user_record.id;
        DELETE FROM email_verifications WHERE user_id = user_record.id;
        DELETE FROM accountability_alerts WHERE user_id = user_record.id;
        DELETE FROM accountability_reminders WHERE user_id = user_record.id;
        DELETE FROM calendar_integrations WHERE user_id = user_record.id;
        DELETE FROM external_calendar_events WHERE user_id = user_record.id;
        DELETE FROM voice_recordings WHERE user_id = user_record.id;
        DELETE FROM security_events WHERE user_id = user_record.id;
        DELETE FROM subscriptions WHERE user_id = user_record.id;
        
        -- Clean up main user data tables
        DELETE FROM assessment_results WHERE user_id = user_record.id;
        DELETE FROM daily_actions WHERE user_id = user_record.id;
        DELETE FROM daily_win_streaks WHERE user_id = user_record.id;
        DELETE FROM notes WHERE user_id = user_record.id;
        DELETE FROM mood_entries WHERE user_id = user_record.id;
        DELETE FROM gratitude_entries WHERE user_id = user_record.id;
        DELETE FROM goals WHERE user_id = user_record.id;
        DELETE FROM calendar_events WHERE user_id = user_record.id;
        DELETE FROM memory_entries WHERE user_id = user_record.id;
        DELETE FROM analytics_events WHERE user_id = user_record.id;
        DELETE FROM support_circle_members WHERE user_id = user_record.id;
        DELETE FROM extracted_actions WHERE user_id = user_record.id;
        DELETE FROM meeting_recordings WHERE user_id = user_record.id;
        DELETE FROM profiles WHERE id = user_record.id;
        
        -- Log the cleanup
        RAISE NOTICE 'Cleaned up data for user: %', user_record.id;
    END LOOP;
    
    -- Finally, delete the auth users (this will cascade to remaining references)
    DELETE FROM auth.users WHERE email LIKE '%annabelaaron%';
    
    RAISE NOTICE 'Completed cleanup of annabelaaron accounts';
END
$$;
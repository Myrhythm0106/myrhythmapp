import { useCallback } from "react";
import { ExtractedAction } from "@/types/memoryBridge";

/**
 * Hook to detect if an action requires a meeting based on keywords and context
 */
export function useMeetingDetection() {
  const detectMeetingRequired = useCallback((action: ExtractedAction): boolean => {
    const meetingKeywords = [
      'meet',
      'meeting',
      'discuss',
      'present',
      'presentation',
      'call',
      'video call',
      'conference',
      'sit down with',
      'talk to',
      'speak with',
      'schedule with',
      'appointment',
      'catch up with',
      'sync with',
      'review with',
      'demo',
      'show',
      'walk through'
    ];

    const actionText = action.action_text.toLowerCase();
    const hasKeyword = meetingKeywords.some(keyword => actionText.includes(keyword));
    
    // Check if action mentions specific people (suggesting collaboration)
    const mentionsPeople = action.assigned_to && action.assigned_to !== 'me';
    
    // Check relationship impact (high impact suggests meeting needed)
    const hasRelationshipImpact = action.relationship_impact && 
                                  action.relationship_impact.toLowerCase().includes('important');
    
    return hasKeyword || (mentionsPeople && hasRelationshipImpact);
  }, []);

  const suggestAttendees = useCallback((action: ExtractedAction): string[] => {
    const suggested: string[] = [];
    
    // Extract names/roles from action text
    const actionText = action.action_text.toLowerCase();
    
    // Common role patterns
    const rolePatterns = [
      'doctor',
      'therapist',
      'counselor',
      'manager',
      'supervisor',
      'team',
      'family',
      'spouse',
      'partner'
    ];
    
    rolePatterns.forEach(role => {
      if (actionText.includes(role)) {
        suggested.push(role);
      }
    });
    
    return suggested;
  }, []);

  return {
    detectMeetingRequired,
    suggestAttendees
  };
}

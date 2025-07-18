import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Send, 
  Check, 
  Clock, 
  AlertCircle,
  Users,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailNotificationSystemProps {
  memberEmail: string;
  memberName: string;
  invitationType: 'accountability_invite' | 'reminder_notification' | 'alert_notification';
  onSent?: () => void;
}

export function EmailNotificationSystem({ 
  memberEmail, 
  memberName, 
  invitationType,
  onSent 
}: EmailNotificationSystemProps) {
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { user } = useAuth();

  const getEmailTemplate = () => {
    const templates = {
      accountability_invite: {
        subject: `${user?.user_metadata?.name || 'Someone'} has invited you to join their MyRhythm Support Circle`,
        preview: 'Join their accountability partnership and support their brain health journey',
        content: `Hi ${memberName},

${user?.user_metadata?.name || 'A friend'} has invited you to join their Support Circle on MyRhythm - a brain health and memory support app.

As part of their support circle, you'll be able to:
• Receive updates on their progress and goals
• Send encouragement and accountability reminders  
• Be notified if they need support or aren't meeting their health goals
• Celebrate their wins and milestones

MyRhythm helps people with brain health concerns, memory challenges, or TBI recovery stay on track with their cognitive wellness routines.

Your support means everything to them on this journey.

Click the link below to accept the invitation and join their circle:
[Accept Invitation - This would be a secure link in a real implementation]

With gratitude,
The MyRhythm Team

P.S. You don't need to create an account or download anything - you can participate via email notifications.`
      },
      reminder_notification: {
        subject: `Gentle reminder from ${user?.user_metadata?.name || 'your accountability partner'}`,
        preview: 'A friendly check-in about your brain health goals',
        content: `Hi ${memberName},

This is a gentle reminder from ${user?.user_metadata?.name || 'your accountability partner'} through MyRhythm.

They wanted to check in and see how you're doing with your brain health goals and daily routine.

Remember: Every small step counts, and they're here to support you.

If you need to reach out or want to update your progress, just reply to this email.

Keep going - you've got this! 💪

Best,
The MyRhythm Team`
      },
      alert_notification: {
        subject: `${user?.user_metadata?.name || 'Your accountability partner'} may need support`,
        preview: 'They haven\'t checked in recently and might appreciate your encouragement',
        content: `Hi ${memberName},

We wanted to let you know that ${user?.user_metadata?.name || 'your accountability partner'} hasn't checked in with their MyRhythm routine for a few days.

As someone in their support circle, you might want to:
• Send them a quick text or call
• Check if they're doing okay
• Offer encouragement or practical help
• Remind them that you're here for them

Sometimes people with brain health challenges need extra support to maintain their routines, and your caring outreach can make all the difference.

Thank you for being part of their support network.

With appreciation,
The MyRhythm Team`
      }
    };

    return templates[invitationType];
  };

  const handleSendEmail = async () => {
    if (!user) return;

    setIsSending(true);
    try {
      const template = getEmailTemplate();
      
      // In a real implementation, this would call a Supabase edge function
      // that sends the actual email using a service like SendGrid, Resend, etc.
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the email for demo purposes
      console.log('Email would be sent:', {
        to: memberEmail,
        subject: template.subject,
        content: template.content
      });

      // Store notification in database for tracking
      const { error } = await supabase
        .from('accountability_alerts')
        .insert({
          user_id: user.id,
          alert_type: 'email_notification',
          title: template.subject,
          message: `Email sent to ${memberName} (${memberEmail})`,
          target_members: [memberEmail],
          sent_at: new Date().toISOString()
        });

      if (error) throw error;

      setEmailSent(true);
      toast.success(`Email sent to ${memberName}!`);
      onSent?.();
      
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const template = getEmailTemplate();

  if (emailSent) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-green-800">Email Sent Successfully!</p>
              <p className="text-sm text-green-600">
                {memberName} will receive the notification at {memberEmail}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Email Notification
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">To: {memberEmail}</Badge>
          <Badge variant="secondary">{invitationType.replace('_', ' ')}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Preview */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Subject:</label>
            <p className="font-medium">{template.subject}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Preview:</label>
            <p className="text-sm text-muted-foreground">{template.preview}</p>
          </div>
        </div>

        {/* Email Content Preview */}
        <div className="bg-white border rounded-lg p-4 max-h-40 overflow-y-auto">
          <pre className="text-sm whitespace-pre-wrap font-sans">
            {template.content}
          </pre>
        </div>

        {/* Send Button */}
        <div className="flex gap-2">
          <Button 
            onClick={handleSendEmail}
            disabled={isSending}
            className="flex-1"
          >
            {isSending ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Email Delivery Info:</p>
              <p>This email will be sent from MyRhythm and include a secure link for {memberName} to respond or take action.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
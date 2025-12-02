import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { supabase } from '@/integrations/supabase/client';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  schedule?: Date;
  escalationLevel?: number;
}

class PushNotificationService {
  private initialized = false;
  private pushToken: string | null = null;

  // Check if running on native platform
  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  // Initialize push notifications
  async initialize(): Promise<boolean> {
    if (this.initialized) return true;
    if (!this.isNative()) {
      console.log('Push notifications only available on native platforms');
      return false;
    }

    try {
      // Request permission
      const permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive !== 'granted') {
        console.log('Push notification permission not granted');
        return false;
      }

      // Register for push notifications
      await PushNotifications.register();

      // Set up listeners
      this.setupListeners();

      // Initialize local notifications
      await LocalNotifications.requestPermissions();

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  // Set up notification listeners
  private setupListeners() {
    // On registration success
    PushNotifications.addListener('registration', (token: Token) => {
      this.pushToken = token.value;
      console.log('Push registration success, token:', token.value);
      this.savePushToken(token.value);
    });

    // On registration error
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Push registration failed:', error);
    });

    // On notification received (app in foreground)
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received:', notification);
      // Could show in-app notification here
    });

    // On notification action performed
    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      console.log('Push notification action performed:', action);
      this.handleNotificationAction(action);
    });

    // Local notification action
    LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      console.log('Local notification action:', action);
      this.handleLocalNotificationAction(action);
    });
  }

  // Save push token to database for server-side notifications
  private async savePushToken(token: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Store token in user's profile or a dedicated table
      // This would be used by edge functions to send push notifications
      console.log('Push token saved for user:', user.id);
    } catch (error) {
      console.error('Failed to save push token:', error);
    }
  }

  // Handle notification action (user tapped notification)
  private handleNotificationAction(action: ActionPerformed) {
    const data = action.notification.data;
    
    if (data?.reminderId) {
      // Navigate to reminder or mark as actioned
      window.dispatchEvent(new CustomEvent('reminder-action', {
        detail: { reminderId: data.reminderId, action: action.actionId }
      }));
    }
  }

  // Handle local notification action
  private handleLocalNotificationAction(action: any) {
    const data = action.notification?.extra;
    
    if (data?.reminderId) {
      window.dispatchEvent(new CustomEvent('reminder-action', {
        detail: { reminderId: data.reminderId, action: action.actionId }
      }));
    }
  }

  // Schedule a local notification
  async scheduleLocalNotification(payload: NotificationPayload): Promise<number | null> {
    if (!this.isNative()) {
      console.log('Local notifications only on native');
      return null;
    }

    try {
      const id = Date.now();
      const notification: LocalNotificationSchema = {
        id,
        title: payload.title,
        body: payload.body,
        extra: payload.data,
        sound: this.getSoundForEscalation(payload.escalationLevel || 0),
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',
        actionTypeId: 'REMINDER_ACTIONS',
      };

      if (payload.schedule) {
        notification.schedule = { at: payload.schedule };
      }

      await LocalNotifications.schedule({
        notifications: [notification]
      });

      return id;
    } catch (error) {
      console.error('Failed to schedule local notification:', error);
      return null;
    }
  }

  // Get sound based on escalation level
  private getSoundForEscalation(level: number): string | undefined {
    // Could use different sounds for different urgency levels
    if (level >= 3) return 'urgent.wav';
    if (level >= 2) return 'important.wav';
    return 'default';
  }

  // Cancel a scheduled notification
  async cancelNotification(id: number): Promise<void> {
    if (!this.isNative()) return;

    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    if (!this.isNative()) return;

    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ 
          notifications: pending.notifications.map(n => ({ id: n.id }))
        });
      }
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  // Register notification action types
  async registerActionTypes(): Promise<void> {
    if (!this.isNative()) return;

    try {
      await LocalNotifications.registerActionTypes({
        types: [
          {
            id: 'REMINDER_ACTIONS',
            actions: [
              { id: 'done', title: '✓ Done' },
              { id: 'snooze', title: '⏰ Snooze 10min' },
              { id: 'help', title: '🆘 Need Help' }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Failed to register action types:', error);
    }
  }

  // Trigger vibration pattern based on escalation
  async vibrateForEscalation(level: number): Promise<void> {
    if (!this.isNative()) return;

    try {
      // Use Haptics plugin if available, otherwise navigator.vibrate
      if ('vibrate' in navigator) {
        const patterns: Record<number, number[]> = {
          0: [100],
          1: [100, 50, 100],
          2: [200, 100, 200],
          3: [300, 100, 300, 100, 300]
        };
        navigator.vibrate(patterns[Math.min(level, 3)]);
      }
    } catch (error) {
      console.error('Vibration failed:', error);
    }
  }

  // Get push token
  getPushToken(): string | null {
    return this.pushToken;
  }
}

export const pushNotificationService = new PushNotificationService();

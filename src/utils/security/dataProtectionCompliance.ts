import { supabase } from '@/integrations/supabase/client';
import { SecureLogger } from './secureLogger';

export interface DataRetentionPolicy {
  tableName: string;
  retentionDays: number;
  archiveBeforeDelete: boolean;
  exemptColumns?: string[];
}

export interface UserDataExport {
  userData: any;
  generatedAt: string;
  userId: string;
  format: 'json' | 'csv';
}

export class DataProtectionCompliance {
  private static readonly retentionPolicies: DataRetentionPolicy[] = [
    { tableName: 'voice_recordings', retentionDays: 365, archiveBeforeDelete: true },
    { tableName: 'security_events', retentionDays: 90, archiveBeforeDelete: false },
    { tableName: 'mfa_verification_attempts', retentionDays: 30, archiveBeforeDelete: false },
    { tableName: 'trusted_devices', retentionDays: 90, archiveBeforeDelete: false },
    { tableName: 'mood_entries', retentionDays: 1095, archiveBeforeDelete: true }, // 3 years
    { tableName: 'memory_entries', retentionDays: 2555, archiveBeforeDelete: true }, // 7 years
  ];

  static async exportUserData(userId: string, format: 'json' | 'csv' = 'json'): Promise<UserDataExport> {
    try {
      SecureLogger.info('User data export requested', { userId, format });

      const userData: any = {};
      
      // Export user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profile) {
        userData.profile = profile;
      }

      // Export user-specific data from various tables
      const tables = [
        'goals', 'daily_actions', 'mood_entries', 'memory_entries',
        'notes', 'gratitude_entries', 'voice_recordings', 'symptom_logs',
        'mfa_factors', 'trusted_devices', 'security_events'
      ];

      for (const table of tables) {
        const { data } = await supabase
          .from(table as any)
          .select('*')
          .eq('user_id', userId);
        
        if (data && data.length > 0) {
          userData[table] = data;
        }
      }

      const exportData: UserDataExport = {
        userData,
        generatedAt: new Date().toISOString(),
        userId,
        format
      };

      SecureLogger.info('User data export completed', { 
        userId, 
        tablesExported: Object.keys(userData).length 
      });

      return exportData;
    } catch (error) {
      SecureLogger.error('User data export failed', error, userId);
      throw new Error('Failed to export user data');
    }
  }

  static async deleteUserData(userId: string, retainProfile: boolean = false): Promise<void> {
    try {
      SecureLogger.critical('User data deletion requested', { userId, retainProfile });

      // Delete user data from all tables
      const tables = [
        'daily_actions', 'mood_entries', 'memory_entries', 'memory_watchers',
        'memory_comments', 'notes', 'gratitude_entries', 'voice_recordings',
        'symptom_logs', 'goals', 'mfa_factors', 'trusted_devices',
        'security_events', 'mfa_verification_attempts', 'support_circle_members',
        'accountability_alerts', 'accountability_reminders', 'subscriptions',
        'payment_methods'
      ];

      const deletionResults: any = {};

      for (const table of tables) {
        const { error, count } = await supabase
          .from(table as any)
          .delete()
          .eq('user_id', userId);
        
        if (error) {
          SecureLogger.error(`Failed to delete from ${table}`, error, userId);
          throw new Error(`Failed to delete data from ${table}`);
        }
        
        deletionResults[table] = count || 0;
      }

      // Optionally delete profile
      if (!retainProfile) {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        if (error) {
          SecureLogger.error('Failed to delete profile', error, userId);
          throw new Error('Failed to delete user profile');
        }
        
        deletionResults.profiles = 1;
      }

      SecureLogger.critical('User data deletion completed', { 
        userId, 
        deletionResults,
        retainProfile 
      });

    } catch (error) {
      SecureLogger.error('User data deletion failed', error, userId);
      throw error;
    }
  }

  static async applyRetentionPolicies(): Promise<{ deletedRecords: number; errors: string[] }> {
    let totalDeleted = 0;
    const errors: string[] = [];

    try {
      SecureLogger.info('Applying data retention policies');

      for (const policy of this.retentionPolicies) {
        try {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);

          const { count, error } = await supabase
            .from(policy.tableName as any)
            .delete()
            .lt('created_at', cutoffDate.toISOString());

          if (error) {
            const errorMsg = `Failed to apply retention policy for ${policy.tableName}: ${error.message}`;
            errors.push(errorMsg);
            SecureLogger.error(errorMsg, error);
          } else {
            totalDeleted += count || 0;
            SecureLogger.info(`Retention policy applied for ${policy.tableName}`, {
              deletedRecords: count,
              cutoffDate: cutoffDate.toISOString()
            });
          }
        } catch (error) {
          const errorMsg = `Exception applying retention policy for ${policy.tableName}`;
          errors.push(errorMsg);
          SecureLogger.error(errorMsg, error);
        }
      }

      return { deletedRecords: totalDeleted, errors };
    } catch (error) {
      SecureLogger.error('Retention policy application failed', error);
      return { deletedRecords: totalDeleted, errors: ['General retention policy failure'] };
    }
  }

  static async auditDataAccess(userId: string, dataType: string, accessType: 'read' | 'write' | 'delete'): Promise<void> {
    try {
      await supabase.rpc('log_security_event', {
        p_user_id: userId,
        p_event_type: `DATA_${accessType.toUpperCase()}`,
        p_event_data: {
          dataType,
          accessType,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });
    } catch (error) {
      SecureLogger.error('Failed to audit data access', error, userId);
    }
  }

  static getRetentionPolicy(tableName: string): DataRetentionPolicy | undefined {
    return this.retentionPolicies.find(policy => policy.tableName === tableName);
  }

  static async generateComplianceReport(userId?: string): Promise<{
    policies: DataRetentionPolicy[];
    lastCleanup: string;
    userDataSummary: any;
  }> {
    try {
      const report: any = {
        policies: this.retentionPolicies,
        lastCleanup: localStorage.getItem('lastRetentionCleanup') || 'Never',
        userDataSummary: {}
      };

      if (userId) {
        // Get user data summary
        for (const policy of this.retentionPolicies) {
          const { count } = await supabase
            .from(policy.tableName as any)
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
          
          report.userDataSummary[policy.tableName] = count || 0;
        }
      }

      return report;
    } catch (error) {
      SecureLogger.error('Failed to generate compliance report', error, userId);
      throw new Error('Failed to generate compliance report');
    }
  }
}
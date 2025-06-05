
export interface MFAFactor {
  id: string;
  factor_type: 'totp' | 'sms' | 'backup_codes';
  factor_name?: string;
  is_verified: boolean;
  is_enabled: boolean;
  phone_number?: string;
  backup_codes?: any[];
  created_at: string;
}

export interface TOTPSetupData {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
}

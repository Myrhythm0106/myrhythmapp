
import React, { useState } from 'react';
import { Smartphone, Key } from 'lucide-react';
import { useMFA } from '@/hooks/useMFA';
import { MFAHeader } from './mfa/MFAHeader';
import { MFATabButton } from './mfa/MFATabButton';
import { TOTPSetupPanel } from './mfa/TOTPSetupPanel';
import { SMSSetupPanel } from './mfa/SMSSetupPanel';
import { BackupCodesPanel } from './mfa/BackupCodesPanel';
import { SecurityBestPractices } from './mfa/SecurityBestPractices';

export function MFASetup() {
  const { 
    factors, 
    mfaEnabled, 
    loading, 
    setupTOTP, 
    verifyTOTP, 
    setupSMS, 
    generateBackupCodes,
    toggleMFA,
    removeFactor 
  } = useMFA();

  const [activeTab, setActiveTab] = useState<'totp' | 'sms' | 'backup'>('totp');

  const totpFactor = factors.find(f => f.factor_type === 'totp');
  const smsFactor = factors.find(f => f.factor_type === 'sms');
  const backupFactor = factors.find(f => f.factor_type === 'backup_codes');

  const verifiedFactorCount = factors.filter(f => f.is_verified).length;

  return (
    <div className="space-y-6">
      <MFAHeader
        mfaEnabled={mfaEnabled}
        factorCount={verifiedFactorCount}
        loading={loading}
        onToggleMFA={toggleMFA}
      />

      {mfaEnabled && (
        <div className="space-y-4">
          <div className="flex gap-2 border-b">
            <MFATabButton
              icon={Smartphone}
              label="Authenticator App"
              isActive={activeTab === 'totp'}
              onClick={() => setActiveTab('totp')}
            />
            <MFATabButton
              icon={Smartphone}
              label="SMS"
              isActive={activeTab === 'sms'}
              onClick={() => setActiveTab('sms')}
            />
            <MFATabButton
              icon={Key}
              label="Backup Codes"
              isActive={activeTab === 'backup'}
              onClick={() => setActiveTab('backup')}
            />
          </div>

          {activeTab === 'totp' && (
            <TOTPSetupPanel
              totpFactor={totpFactor}
              loading={loading}
              onSetupTOTP={setupTOTP}
              onVerifyTOTP={verifyTOTP}
              onRemoveFactor={removeFactor}
            />
          )}

          {activeTab === 'sms' && (
            <SMSSetupPanel
              smsFactor={smsFactor}
              loading={loading}
              onSetupSMS={setupSMS}
              onRemoveFactor={removeFactor}
            />
          )}

          {activeTab === 'backup' && (
            <BackupCodesPanel
              backupFactor={backupFactor}
              loading={loading}
              onGenerateBackupCodes={generateBackupCodes}
            />
          )}
        </div>
      )}

      <SecurityBestPractices />
    </div>
  );
}

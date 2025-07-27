
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Copy, Download } from 'lucide-react';
import { MFAFactor } from '@/types/mfa';
import { toast } from 'sonner';
import { SecureLogger } from '@/utils/security/secureLogger';

interface BackupCode {
  code: string;
}

interface BackupCodesPanelProps {
  backupFactor: MFAFactor | undefined;
  loading: boolean;
  onGenerateBackupCodes: () => Promise<any>;
}

export function BackupCodesPanel({
  backupFactor,
  loading,
  onGenerateBackupCodes
}: BackupCodesPanelProps) {
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);

  const handleGenerateBackupCodes = async () => {
    const codes = await onGenerateBackupCodes();
    if (codes) {
      try {
        if (Array.isArray(codes)) {
          const typedCodes: BackupCode[] = codes.map(item => {
            if (typeof item === 'object' && item !== null && 'code' in item) {
              return { code: String(item.code) };
            }
            return { code: String(item) };
          });
          setBackupCodes(typedCodes);
        } else {
          SecureLogger.error('Unexpected backup codes format', { codes });
          toast.error('Failed to process backup codes');
        }
      } catch (error) {
        SecureLogger.error('Error processing backup codes', error);
        toast.error('Failed to process backup codes');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes
      .map(code => code.code)
      .join('\n');
    
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myrhythm-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded');
  };

  return (
    <div className="space-y-4">
      {backupFactor ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Backup codes are active. Store them securely as they can only be used once each.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Backup codes are one-time use recovery codes. 
              Store them securely in case you lose access to your other MFA methods.
            </AlertDescription>
          </Alert>
          <Button onClick={handleGenerateBackupCodes} disabled={loading}>
            Generate Backup Codes
          </Button>
        </div>
      )}

      {backupCodes.length > 0 && (
        <div className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Save these codes now!</strong> You won't be able to see them again.
            </AlertDescription>
          </Alert>
          
          <div className="bg-gray-50 p-4 rounded border">
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="text-center p-2 bg-white rounded border">
                  {code.code}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => copyToClipboard(backupCodes.map(c => c.code).join('\n'))}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
            <Button
              variant="outline"
              onClick={downloadBackupCodes}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

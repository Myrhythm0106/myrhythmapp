
export function generateTOTPSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

export function verifyTOTPCode(code: string, factorId: string): boolean {
  // In a real implementation, use a TOTP library like 'otplib'
  // For demo purposes, accept any 6-digit code
  return /^\d{6}$/.test(code);
}

export function generateQRCodeUrl(secret: string, issuer: string, accountName: string): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
}

export function formatManualEntryKey(secret: string): string {
  return secret.match(/.{1,4}/g)?.join(' ') || secret;
}


import { authenticator } from 'otplib';

export function generateTOTPSecret(): string {
  return authenticator.generateSecret();
}

export function verifyTOTPCode(code: string, secret: string): boolean {
  return authenticator.verify({
    token: code,
    secret: secret
  });
}

export function generateQRCodeUrl(secret: string, issuer: string, accountName: string): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
}

export function formatManualEntryKey(secret: string): string {
  return secret.match(/.{1,4}/g)?.join(' ') || secret;
}

import { SecureLogger } from './secureLogger';

export interface CSPConfig {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'connect-src': string[];
  'font-src': string[];
  'object-src': string[];
  'media-src': string[];
  'frame-src': string[];
}

export class SecurityHeaders {
  private static readonly defaultCSP: CSPConfig = {
    'default-src': ["'self'"],
    'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
    'style-src': ["'self'", 'https://fonts.googleapis.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'connect-src': ["'self'", 'https://*.supabase.co', 'wss://*.supabase.co'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'object-src': ["'none'"],
    'media-src': ["'self'", 'blob:'],
    'frame-src': ["'self'"]
  };

  static generateCSP(customConfig?: Partial<CSPConfig>): string {
    const config = { ...this.defaultCSP, ...customConfig };
    
    return Object.entries(config)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }

  static applySecurityHeaders(): void {
    try {
      // Note: These headers should ideally be set by the server
      // This is a client-side fallback for additional protection
      
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = this.generateCSP();
      document.head.appendChild(meta);

      // Other security headers (if possible to set client-side)
      this.setSecurityMeta('X-Content-Type-Options', 'nosniff');
      this.setSecurityMeta('X-Frame-Options', 'DENY');
      this.setSecurityMeta('X-XSS-Protection', '1; mode=block');
      this.setSecurityMeta('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      SecureLogger.info('Security headers applied', { csp: 'enabled' });
    } catch (error) {
      SecureLogger.error('Failed to apply security headers', error);
    }
  }

  private static setSecurityMeta(name: string, content: string): void {
    const meta = document.createElement('meta');
    meta.httpEquiv = name;
    meta.content = content;
    document.head.appendChild(meta);
  }

  static validateCSP(): { violations: string[]; score: number } {
    const violations: string[] = [];
    let score = 100;

    // Check for unsafe practices
    const scripts = document.querySelectorAll('script:not([src])');
    if (scripts.length > 0) {
      violations.push(`Found ${scripts.length} inline script(s) - potential CSP violation`);
      score -= 20;
    }

    const inlineStyles = document.querySelectorAll('[style]');
    if (inlineStyles.length > 10) {
      violations.push(`Found ${inlineStyles.length} inline styles - consider using CSS classes`);
      score -= 10;
    }

    // Check for mixed content
    const insecureResources = Array.from(document.querySelectorAll('img, script, link')).filter(
      (element) => {
        const src = element.getAttribute('src') || element.getAttribute('href');
        return src && src.startsWith('http://') && location.protocol === 'https:';
      }
    );

    if (insecureResources.length > 0) {
      violations.push(`Found ${insecureResources.length} insecure resource(s) loaded over HTTP`);
      score -= 30;
    }

    return { violations, score: Math.max(0, score) };
  }

  static sanitizeHTML(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  static preventXSS(input: string): string {
    return input
      .replace(/[<>\\\"']/g, (match) => {
        const escapeMap: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '\"': '&quot;',
          "'": '&#x27;'
        };
        return escapeMap[match];
      });
  }

  static validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }
      
      // Prevent localhost and private IPs in production
      if (import.meta.env.PROD && (
        urlObj.hostname === 'localhost' ||
        urlObj.hostname.startsWith('127.') ||
        urlObj.hostname.startsWith('192.168.') ||
        urlObj.hostname.startsWith('10.')
      )) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }
}


export class HtmlSanitizer {
  static sanitizeHtml(input: string): string {
    if (!input) return '';
    
    // Create a temporary div to safely parse HTML
    const div = document.createElement('div');
    div.textContent = input;
    
    // Additional XSS protection
    return div.innerHTML
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  }

  static sanitizeText(input: string, maxLength: number = 1000): string {
    if (!input) return '';
    
    // Remove dangerous SQL injection patterns
    const sqlPatterns = [
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/gi,
      /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/gi,
      /[';"](\s*(OR|AND)\s*)?[';"]?\s*=\s*[';"]?/gi
    ];
    
    let sanitized = input;
    sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Remove script tags and dangerous HTML
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .substring(0, maxLength);
    
    return this.sanitizeHtml(sanitized);
  }
}

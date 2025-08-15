/**
 * XSS Protection utilities for secure content rendering
 */

import DOMPurify from 'dompurify';

export class XSSProtection {
  /**
   * Safely renders audio content by extracting only audio elements
   * and sanitizing their attributes
   */
  static sanitizeAudioContent(content: string): string {
    // Create a temporary container to parse the content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Extract only audio elements
    const audioElements = tempDiv.querySelectorAll('audio');
    
    if (audioElements.length === 0) {
      return this.escapeHtml(content);
    }
    
    // Sanitize each audio element
    let sanitizedContent = '';
    audioElements.forEach(audio => {
      const sanitizedAudio = document.createElement('audio');
      sanitizedAudio.controls = true;
      
      // Only allow safe attributes
      const allowedAttributes = ['src', 'controls', 'preload'];
      allowedAttributes.forEach(attr => {
        const value = audio.getAttribute(attr);
        if (value && this.isValidAudioAttribute(attr, value)) {
          sanitizedAudio.setAttribute(attr, value);
        }
      });
      
      sanitizedContent += sanitizedAudio.outerHTML;
    });
    
    return sanitizedContent;
  }
  
  /**
   * Validates audio element attributes to prevent XSS
   */
  private static isValidAudioAttribute(attribute: string, value: string): boolean {
    switch (attribute) {
      case 'src':
        return this.isValidAudioUrl(value);
      case 'controls':
        return value === 'true' || value === '';
      case 'preload':
        return ['none', 'metadata', 'auto'].includes(value);
      default:
        return false;
    }
  }
  
  /**
   * Validates audio URLs to prevent XSS and ensure they're safe
   */
  private static isValidAudioUrl(url: string): boolean {
    try {
      const urlObj = new URL(url, window.location.origin);
      
      // Only allow same origin, https, or blob URLs
      if (urlObj.protocol === 'blob:' || 
          urlObj.protocol === 'data:' ||
          (urlObj.protocol === 'https:' && urlObj.origin !== window.location.origin)) {
        return true;
      }
      
      // Same origin URLs are safe
      if (urlObj.origin === window.location.origin) {
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }
  
  /**
   * Escapes HTML to prevent XSS
   */
  static escapeHtml(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
  
  /**
   * Sanitizes HTML using DOMPurify with strict settings
   */
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['audio', 'source'],
      ALLOWED_ATTR: ['src', 'controls', 'preload', 'type'],
      FORBID_TAGS: ['script', 'object', 'embed', 'iframe'],
      FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover']
    });
  }
}
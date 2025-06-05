
import { toast } from "sonner";

export class UrlValidator {
  static validateUrl(url: string): boolean {
    if (!url) return false;
    
    try {
      const urlObject = new URL(url);
      
      // Only allow HTTP and HTTPS
      if (!['http:', 'https:'].includes(urlObject.protocol)) {
        toast.error("Only HTTP and HTTPS URLs are allowed");
        return false;
      }
      
      // Block localhost and private IPs for security
      const hostname = urlObject.hostname;
      if (hostname === 'localhost' || 
          hostname.startsWith('127.') || 
          hostname.startsWith('192.168.') || 
          hostname.startsWith('10.') || 
          hostname.startsWith('172.')) {
        toast.error("Local and private network URLs are not allowed");
        return false;
      }
      
      return true;
    } catch {
      toast.error("Invalid URL format");
      return false;
    }
  }
}

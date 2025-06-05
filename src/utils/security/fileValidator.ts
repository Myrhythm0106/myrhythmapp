
import { toast } from "sonner";

export class FileValidator {
  static validateFileUpload(file: File, allowedTypes: string[], maxSizeBytes: number = 5 * 1024 * 1024): boolean {
    if (!file) {
      toast.error("No file selected");
      return false;
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      return false;
    }
    
    // Check file size
    if (file.size > maxSizeBytes) {
      const maxSizeMB = maxSizeBytes / (1024 * 1024);
      toast.error(`File size too large. Maximum size: ${maxSizeMB}MB`);
      return false;
    }
    
    // Check for dangerous file names
    if (/[<>:"/\\|?*]/.test(file.name) || file.name.startsWith('.')) {
      toast.error("Invalid file name");
      return false;
    }
    
    return true;
  }
}

export interface ProcessingProgress {
  stage: 'uploading' | 'transcribing' | 'extracting' | 'complete' | 'failed';
  progress: number; // 0-100
  elapsedTime: number; // in seconds
  estimatedRemaining: number; // in seconds
  message?: string;
}

export interface ProcessingStageInfo {
  name: string;
  icon: string;
  color: string;
}

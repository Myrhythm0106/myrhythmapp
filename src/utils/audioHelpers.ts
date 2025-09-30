/**
 * Get the duration of an audio blob in seconds
 */
export async function getAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio();
      const url = URL.createObjectURL(blob);
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = Math.ceil(audio.duration);
        URL.revokeObjectURL(url);
        resolve(duration);
      });
      
      audio.addEventListener('error', (error) => {
        URL.revokeObjectURL(url);
        console.error('Error loading audio metadata:', error);
        // Return 0 if we can't determine duration
        resolve(0);
      });
      
      audio.src = url;
    } catch (error) {
      console.error('Error creating audio element:', error);
      resolve(0);
    }
  });
}

/**
 * Format seconds into MM:SS display
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

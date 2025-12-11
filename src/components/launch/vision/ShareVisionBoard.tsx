import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Loader2, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dream } from './DreamCard';
import { toast } from 'sonner';

interface ShareVisionBoardProps {
  open: boolean;
  onClose: () => void;
  dreams: Dream[];
  yearlyTheme: string;
  affirmation: string;
  year?: number;
}

export function ShareVisionBoard({
  open,
  onClose,
  dreams,
  yearlyTheme,
  affirmation,
  year = new Date().getFullYear()
}: ShareVisionBoardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Create a canvas-based export
      // For production, you would use html2canvas or a similar library
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
      gradient.addColorStop(0, '#f0f9ff'); // brain-health-50
      gradient.addColorStop(0.5, '#f5f3ff'); // neural-purple-50
      gradient.addColorStop(1, '#ecfdf5'); // memory-emerald-50
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Add header
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 48px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('My Vision Board', 540, 120);
      
      ctx.font = '32px system-ui, sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`${year} - ${yearlyTheme || 'My Year of Growth'}`, 540, 180);

      // Add dreams
      let yOffset = 280;
      const maxDreams = Math.min(dreams.length, 5);
      
      for (let i = 0; i < maxDreams; i++) {
        const dream = dreams[i];
        
        // Dream card background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.roundRect(80, yOffset, 920, 220, 24);
        ctx.fill();
        
        // Emoji
        ctx.font = '64px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(dream.emoji || '✨', 120, yOffset + 85);
        
        // Title
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 36px system-ui, sans-serif';
        ctx.fillText(dream.title.slice(0, 30), 210, yOffset + 70);
        
        // Why
        ctx.fillStyle = '#6b7280';
        ctx.font = '24px system-ui, sans-serif';
        const whyText = dream.why.slice(0, 50) + (dream.why.length > 50 ? '...' : '');
        ctx.fillText(whyText, 210, yOffset + 115);
        
        // Progress bar
        ctx.fillStyle = '#e5e7eb';
        ctx.beginPath();
        ctx.roundRect(210, yOffset + 150, 700, 16, 8);
        ctx.fill();
        
        ctx.fillStyle = '#14b8a6';
        ctx.beginPath();
        ctx.roundRect(210, yOffset + 150, (700 * dream.progress) / 100, 16, 8);
        ctx.fill();
        
        // Progress text
        ctx.fillStyle = '#14b8a6';
        ctx.font = 'bold 20px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${dream.progress}%`, 920, yOffset + 185);
        ctx.textAlign = 'left';
        
        yOffset += 260;
      }

      // Add affirmation at bottom
      if (affirmation) {
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.beginPath();
        ctx.roundRect(80, 1600, 920, 140, 24);
        ctx.fill();
        
        ctx.fillStyle = '#7c3aed';
        ctx.font = 'italic 28px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`"${affirmation.slice(0, 60)}"`, 540, 1680);
      }

      // Add watermark
      ctx.fillStyle = '#9ca3af';
      ctx.font = '20px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Created with MyRhythm', 540, 1880);

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `vision-board-${year}.png`;
      link.href = dataUrl;
      link.click();

      setExportComplete(true);
      toast.success('Vision Board saved as wallpaper!');
      
      setTimeout(() => {
        setExportComplete(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export vision board');
    } finally {
      setIsExporting(false);
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-card rounded-2xl shadow-xl border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neural-purple-500 to-brain-health-500 flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Save as Wallpaper</h2>
              <p className="text-xs text-muted-foreground">Perfect for your phone background</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Preview */}
        <div className="p-6">
          <div 
            ref={canvasRef}
            className={cn(
              "aspect-[9/16] rounded-xl overflow-hidden",
              "bg-gradient-to-b from-brain-health-50 via-neural-purple-50 to-memory-emerald-50",
              "border shadow-inner p-4"
            )}
          >
            {/* Mini Preview */}
            <div className="h-full flex flex-col">
              <div className="text-center mb-4">
                <Sparkles className="h-6 w-6 text-neural-purple-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-foreground">My Vision Board</h3>
                <p className="text-[10px] text-muted-foreground">{year}</p>
              </div>

              <div className="flex-1 space-y-2 overflow-hidden">
                {dreams.slice(0, 4).map((dream, i) => (
                  <div 
                    key={dream.id}
                    className="bg-white/80 rounded-lg p-2 flex items-center gap-2"
                  >
                    <span className="text-sm">{dream.emoji || '✨'}</span>
                    <span className="text-[10px] font-medium truncate flex-1">
                      {dream.title}
                    </span>
                  </div>
                ))}
              </div>

              {affirmation && (
                <div className="mt-auto pt-4">
                  <p className="text-[8px] text-center text-neural-purple-600 italic">
                    "{affirmation.slice(0, 40)}..."
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Your vision board will be exported as a 1080x1920 phone wallpaper
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <Button
            onClick={handleExport}
            disabled={isExporting || exportComplete}
            className={cn(
              "w-full",
              exportComplete 
                ? "bg-memory-emerald-500 hover:bg-memory-emerald-600"
                : "bg-gradient-to-r from-neural-purple-500 to-brain-health-500 hover:from-neural-purple-600 hover:to-brain-health-600"
            )}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Wallpaper...
              </>
            ) : exportComplete ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Wallpaper
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

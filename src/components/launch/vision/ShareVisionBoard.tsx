import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Loader2, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Dream {
  id: string;
  title: string;
  why?: string;
  emoji?: string;
  category?: string;
  progress: number;
  linkedGoalId?: string;
  linkedGoalTitle?: string;
  createdAt: string;
}

interface ShareVisionBoardProps {
  open: boolean;
  onClose: () => void;
  dreams: Dream[];
  yearlyTheme: string;
  affirmation: string;
  year?: number;
}

// Pillar colors for the wallpaper
const pillarColors: Record<string, { from: string; to: string }> = {
  'mind-growth': { from: '#8B5CF6', to: '#3B82F6' },
  'health-body': { from: '#14B8A6', to: '#10B981' },
  'relationships': { from: '#EC4899', to: '#F472B6' },
  'financial': { from: '#F97316', to: '#FB923C' },
  'purpose-joy': { from: '#3B82F6', to: '#14B8A6' }
};

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
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
      gradient.addColorStop(0, '#FAF5FF'); // neural-purple-50
      gradient.addColorStop(0.5, '#F0FDFA'); // brain-health-50
      gradient.addColorStop(1, '#EFF6FF'); // neural-blue-50
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Add header
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 56px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('My Vision Board', 540, 140);
      
      ctx.font = '36px system-ui, sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`${year} — Year of ${yearlyTheme}`, 540, 200);

      // Draw quadrant grid (2x2 + 1 full width)
      const cardWidth = 480;
      const cardHeight = 320;
      const gap = 30;
      const startX = 60;
      let yOffset = 280;

      // Draw first 4 dreams in 2x2 grid
      const gridDreams = dreams.slice(0, 4);
      gridDreams.forEach((dream, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = startX + col * (cardWidth + gap);
        const y = yOffset + row * (cardHeight + gap);
        
        // Card gradient background
        const colors = pillarColors[dream.category || 'mind-growth'] || pillarColors['mind-growth'];
        const cardGrad = ctx.createLinearGradient(x, y, x + cardWidth, y + cardHeight);
        cardGrad.addColorStop(0, colors.from);
        cardGrad.addColorStop(1, colors.to);
        ctx.fillStyle = cardGrad;
        ctx.beginPath();
        ctx.roundRect(x, y, cardWidth, cardHeight, 24);
        ctx.fill();

        // Emoji
        ctx.font = '56px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(dream.emoji || '✨', x + 30, y + 70);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px system-ui, sans-serif';
        ctx.fillText(dream.title.slice(0, 20), x + 30, y + 140);

        // Progress dots
        for (let j = 0; j < 5; j++) {
          const dotX = x + 30 + j * 30;
          const dotY = y + cardHeight - 50;
          const filled = dream.progress >= (j + 1) * 20;
          ctx.beginPath();
          ctx.arc(dotX + 8, dotY, 10, 0, Math.PI * 2);
          ctx.fillStyle = filled ? '#ffffff' : 'rgba(255,255,255,0.4)';
          ctx.fill();
        }
      });

      // Draw 5th dream (full width) if exists
      if (dreams.length >= 5) {
        const dream = dreams[4];
        const fullY = yOffset + 2 * (cardHeight + gap);
        const fullWidth = cardWidth * 2 + gap;
        
        const colors = pillarColors[dream.category || 'purpose-joy'] || pillarColors['purpose-joy'];
        const cardGrad = ctx.createLinearGradient(startX, fullY, startX + fullWidth, fullY + 200);
        cardGrad.addColorStop(0, colors.from);
        cardGrad.addColorStop(1, colors.to);
        ctx.fillStyle = cardGrad;
        ctx.beginPath();
        ctx.roundRect(startX, fullY, fullWidth, 200, 24);
        ctx.fill();

        ctx.font = '56px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(dream.emoji || '🌟', startX + 40, fullY + 80);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px system-ui, sans-serif';
        ctx.fillText(dream.title.slice(0, 35), startX + 40, fullY + 140);
      }

      // Add affirmation at bottom
      if (affirmation) {
        ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
        ctx.beginPath();
        ctx.roundRect(60, 1650, 960, 120, 24);
        ctx.fill();
        
        ctx.fillStyle = '#7c3aed';
        ctx.font = 'italic 28px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`"${affirmation.slice(0, 55)}${affirmation.length > 55 ? '...' : ''}"`, 540, 1720);
      }

      // Add watermark
      ctx.fillStyle = '#9ca3af';
      ctx.font = '22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Created with MyRhythm', 540, 1860);

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
              <p className="text-xs text-muted-foreground">Beautiful 5-pillar vision board</p>
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
              "bg-gradient-to-b from-neural-purple-50 via-brain-health-50 to-neural-blue-50",
              "border shadow-inner p-3"
            )}
          >
            {/* Mini Preview */}
            <div className="h-full flex flex-col">
              <div className="text-center mb-3">
                <Sparkles className="h-5 w-5 text-neural-purple-500 mx-auto mb-1" />
                <h3 className="text-xs font-bold text-foreground">My Vision Board</h3>
                <p className="text-[8px] text-muted-foreground">{year} — Year of {yearlyTheme}</p>
              </div>

              {/* Mini 2x2 Grid */}
              <div className="grid grid-cols-2 gap-1.5 flex-1">
                {dreams.slice(0, 4).map((dream) => {
                  const colors = pillarColors[dream.category || 'mind-growth'];
                  return (
                    <div 
                      key={dream.id}
                      className="rounded-lg p-2 flex flex-col justify-between"
                      style={{ background: `linear-gradient(135deg, ${colors?.from || '#8B5CF6'}, ${colors?.to || '#3B82F6'})` }}
                    >
                      <span className="text-sm">{dream.emoji || '✨'}</span>
                      <span className="text-[7px] font-medium text-white truncate">
                        {dream.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mini Full Width */}
              {dreams[4] && (
                <div 
                  className="mt-1.5 rounded-lg p-2 flex items-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${pillarColors[dreams[4].category || 'purpose-joy']?.from || '#3B82F6'}, ${pillarColors[dreams[4].category || 'purpose-joy']?.to || '#14B8A6'})` 
                  }}
                >
                  <span className="text-sm">{dreams[4].emoji || '🌟'}</span>
                  <span className="text-[8px] font-medium text-white truncate">
                    {dreams[4].title}
                  </span>
                </div>
              )}

              {affirmation && (
                <div className="mt-auto pt-2">
                  <p className="text-[7px] text-center text-neural-purple-600 italic">
                    "{affirmation.slice(0, 35)}..."
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Your 5-pillar vision board as a phone wallpaper
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

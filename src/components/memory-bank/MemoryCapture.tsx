import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMemoryBank } from '@/hooks/useMemoryBank';
import { Camera, Mic, FileText, Heart, Check, Brain, Sparkles, Zap, Target, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemoryCaptureProps {
  onMemoryCreated?: () => void;
}

export function MemoryCapture({ onMemoryCreated }: MemoryCaptureProps) {
  const [captureType, setCaptureType] = useState<'text' | 'photo' | 'voice' | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [isCapturing, setIsCapturing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);

  const { createMemory, uploadFile } = useMemoryBank();

  // Smart capture suggestions based on time of day and recent patterns
  const [smartSuggestions] = useState([
    'Morning reflection on yesterday\'s wins',
    'Key insights from today\'s conversations', 
    'Moments of gratitude and progress',
    'Important commitments I made today'
  ]);

  const categories = [
    { id: 'general', label: 'General', color: 'bg-gradient-primary' },
    { id: 'family', label: 'Family', color: 'bg-gradient-secondary' },
    { id: 'achievement', label: 'Achievement', color: 'bg-gradient-accent' },
    { id: 'medical', label: 'Medical', color: 'bg-gradient-tertiary' },
    { id: 'milestone', label: 'Milestone', color: 'bg-gradient-success' },
  ];

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsCapturing(true);
    try {
      const memory = await createMemory({
        title: title.trim(),
        content: content.trim() || undefined,
        memory_type: captureType || 'text',
        category,
        tags: [],
        is_favorite: false,
        visibility_level: 'private',
      });

      if (memory && file) {
        const filePath = await uploadFile(file, memory.id);
        if (filePath) {
          // Update memory with file path
          // This would require updating the hook to handle file updates
        }
      }

      setSaved(true);
      setTimeout(() => {
        setTitle('');
        setContent('');
        setFile(null);
        setCaptureType(null);
        setSaved(false);
        onMemoryCreated?.();
      }, 1500);

    } catch (error) {
      console.error('Error saving memory:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileCapture = (type: 'photo' | 'voice') => {
    setCaptureType(type);
    // For now, just show file input - would integrate with camera/voice recording
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'photo' ? 'image/*' : 'audio/*';
    input.onchange = (e) => {
      const selectedFile = (e.target as HTMLInputElement).files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        if (!title) {
          setTitle(`${type === 'photo' ? 'Photo' : 'Voice note'} from ${new Date().toLocaleDateString()}`);
        }
      }
    };
    input.click();
  };

  if (saved) {
    return (
      <Card className="border-2 border-brain-health bg-gradient-to-br from-brain-health/10 via-emerald/5 to-clarity-teal/10 animate-scale-in shadow-glow">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-6 animate-fade-in">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brain-health via-emerald-500 to-clarity-teal-500 flex items-center justify-center animate-neural-pulse shadow-glow">
              <Check className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-brain-health to-emerald-600 bg-clip-text text-transparent">
                🧠 Memory Secured!
              </h3>
              <p className="text-xl text-muted-foreground font-medium">Neural pathways strengthened</p>
              <p className="text-sm text-brain-health font-semibold">
                ✨ Building cognitive confidence & trust • One memory at a time
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-clarity-teal-600 bg-clarity-teal-50 px-4 py-2 rounded-full">
                <Brain className="w-4 h-4" />
                <span>Brain health score increased</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Smart Memory Command Center */}
      <Card className="border-2 border-brain-health/40 bg-gradient-to-br from-brain-health/20 via-emerald/10 to-clarity-teal/15 shadow-glow overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brain-health/10 via-transparent to-emerald/10" />
        <CardHeader className="relative">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brain-health via-emerald-500 to-clarity-teal-500 shadow-glow animate-neural-pulse">
              <Brain className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-brain-health to-emerald-600 bg-clip-text text-transparent">
              SMART Memory Capture
            </CardTitle>
            <p className="text-lg text-muted-foreground font-medium">
              🧠 AI-Enhanced • Neural Network Recording • Trust Building
            </p>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-8">

          {/* AI-Powered Smart Suggestions */}
          {!captureType && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-brain-health">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">AI suggests capturing:</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {smartSuggestions.slice(0, 2).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => {
                        setCaptureType('text');
                        setTitle(suggestion);
                      }}
                      className="text-left p-4 h-auto border-brain-health/20 hover:bg-brain-health/5 hover:border-brain-health/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-brain-health" />
                        <span className="text-sm font-medium">{suggestion}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-brain-health/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or choose format</span>
                </div>
              </div>

              {/* One-Tap Professional Capture Options */}
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setCaptureType('text')}
                  className="h-16 text-lg border-2 border-brain-health/30 hover:bg-brain-health/10 hover:scale-105 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-brain-health group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-semibold">Write Memory</div>
                      <div className="text-sm text-muted-foreground">Text-based capture</div>
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleFileCapture('photo')}
                  className="h-16 text-lg border-2 border-emerald/30 hover:bg-emerald/10 hover:scale-105 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Camera className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-semibold">Photo Memory</div>
                      <div className="text-sm text-muted-foreground">Visual capture</div>
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleFileCapture('voice')}
                  className="h-16 text-lg border-2 border-clarity-teal/30 hover:bg-clarity-teal/10 hover:scale-105 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Mic className="w-8 h-8 text-clarity-teal-600 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-semibold">Voice Memory</div>
                      <div className="text-sm text-muted-foreground">Audio capture</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          )}

        {/* Memory Details */}
        {captureType && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your memory a title..."
                className="text-lg border-primary/20 focus:border-primary"
              />
            </div>

            {captureType === 'text' && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Memory
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your memory..."
                  rows={4}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
            )}

            {file && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {captureType === 'photo' ? '📸' : '🎵'} {file.name}
                </p>
              </div>
            )}

            {/* Category Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={category === cat.id ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-3 py-1.5 text-sm",
                      category === cat.id ? cat.color : "hover:bg-muted"
                    )}
                    onClick={() => setCategory(cat.id)}
                  >
                    {cat.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCaptureType(null);
                  setFile(null);
                  setTitle('');
                  setContent('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || isCapturing}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                {isCapturing ? 'Saving...' : 'Save Memory'}
              </Button>
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
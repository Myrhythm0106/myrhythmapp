import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMemoryBank } from '@/hooks/useMemoryBank';
import { Camera, Mic, FileText, Heart, Check } from 'lucide-react';
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

  const { createMemory, uploadFile } = useMemoryBank();

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
      <Card className="border-2 border-memory-emerald bg-gradient-to-r from-memory-emerald/10 to-brain-health/10 animate-scale-in">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-6 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-gradient-memory flex items-center justify-center animate-pulse shadow-glow">
              <Check className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-memory-emerald">🎉 Memory Captured!</h3>
              <p className="text-lg text-muted-foreground">Another precious moment safely stored</p>
              <p className="text-sm text-brain-health font-medium">Building your confidence, one memory at a time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-memory-emerald/30 bg-gradient-trust shadow-glow">
      <CardContent className="p-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-memory shadow-glow">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-memory-emerald to-brain-health bg-clip-text text-transparent">
            Capture a Memory
          </h2>
          <p className="text-lg text-muted-foreground">
            Every memory matters - capture it with confidence
          </p>
        </div>

        {/* One-Tap Capture Selection - Senior Friendly */}
        {!captureType && (
          <div className="space-y-6">
            <p className="text-center text-lg text-muted-foreground">
              How would you like to capture this memory?
            </p>
            <div className="grid grid-cols-1 gap-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCaptureType('text')}
                className="h-20 text-xl border-2 border-memory-emerald/30 hover:bg-memory-emerald/10 hover:scale-105 transition-all"
              >
                <FileText className="w-10 h-10 text-memory-emerald mr-4" />
                <span>Write a Memory</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleFileCapture('photo')}
                className="h-20 text-xl border-2 border-brain-health/30 hover:bg-brain-health/10 hover:scale-105 transition-all"
              >
                <Camera className="w-10 h-10 text-brain-health mr-4" />
                <span>Add a Photo</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleFileCapture('voice')}
                className="h-20 text-xl border-2 border-memory-emerald/30 hover:bg-memory-emerald/10 hover:scale-105 transition-all"
              >
                <Mic className="w-10 h-10 text-memory-emerald mr-4" />
                <span>Record Voice Note</span>
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
  );
}
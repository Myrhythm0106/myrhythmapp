import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Upload, Wand2, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { dreamEmojis } from '@/data/dreamPromptSuggestions';
import { toast } from 'sonner';

interface VisionImagePickerProps {
  selectedEmoji: string;
  onEmojiChange: (emoji: string) => void;
  imageUrl?: string;
  onImageChange: (url: string | undefined) => void;
  category?: string;
}

export function VisionImagePicker({
  selectedEmoji,
  onEmojiChange,
  imageUrl,
  onImageChange,
  category = 'personal'
}: VisionImagePickerProps) {
  const [activeTab, setActiveTab] = useState<string>(imageUrl ? 'upload' : 'emoji');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Get emoji options for current category
  const categoryEmojis = dreamEmojis[category as keyof typeof dreamEmojis] || dreamEmojis.personal;
  const allEmojis = [...new Set([...categoryEmojis, ...dreamEmojis.personal])];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // For now, create a local preview URL
      // In production, this would upload to Supabase Storage
      const previewUrl = URL.createObjectURL(file);
      onImageChange(previewUrl);
      toast.success('Image added!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe the image you want');
      return;
    }

    setIsGenerating(true);
    try {
      // TODO: Call the generate-vision-image edge function
      toast.info('AI image generation coming soon!');
      // For now, show placeholder
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearImage = () => {
    onImageChange(undefined);
    setActiveTab('emoji');
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Add a visual (optional)
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose an emoji, upload a photo, or generate an image
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="emoji" className="flex flex-col gap-1 py-2">
            <Smile className="h-4 w-4" />
            <span className="text-xs">Emoji</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex flex-col gap-1 py-2">
            <Upload className="h-4 w-4" />
            <span className="text-xs">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex flex-col gap-1 py-2">
            <Wand2 className="h-4 w-4" />
            <span className="text-xs">AI Generate</span>
          </TabsTrigger>
        </TabsList>

        {/* Emoji Selection */}
        <TabsContent value="emoji" className="mt-4">
          <div className="grid grid-cols-8 gap-2">
            {allEmojis.map((emoji, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onEmojiChange(emoji);
                  onImageChange(undefined);
                }}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-xl",
                  "border-2 transition-all",
                  selectedEmoji === emoji && !imageUrl
                    ? "bg-brain-health-100 border-brain-health-400"
                    : "bg-card border-border hover:border-brain-health-200"
                )}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </TabsContent>

        {/* Upload Photo */}
        <TabsContent value="upload" className="mt-4">
          {imageUrl ? (
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Dream visualization" 
                className="w-full h-48 object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className={cn(
              "flex flex-col items-center justify-center gap-3 py-8",
              "border-2 border-dashed border-border rounded-xl",
              "hover:border-brain-health-300 hover:bg-brain-health-50/50",
              "cursor-pointer transition-all"
            )}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-brain-health-500 animate-spin" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {isUploading ? 'Uploading...' : 'Tap to upload a photo'}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG up to 5MB
                </p>
              </div>
            </label>
          )}
        </TabsContent>

        {/* AI Generate */}
        <TabsContent value="ai" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your dream vision..."
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              e.g., "A peaceful morning with sunrise and coffee" or "Running a marathon at sunset"
            </p>
          </div>
          
          <Button
            onClick={handleAiGenerate}
            disabled={isGenerating || !aiPrompt.trim()}
            className="w-full bg-gradient-to-r from-neural-purple-500 to-brain-health-500"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>

          {imageUrl && (
            <div className="relative rounded-xl overflow-hidden mt-4">
              <img 
                src={imageUrl} 
                alt="AI generated vision" 
                className="w-full h-48 object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Current Selection Preview */}
      {!imageUrl && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brain-health-100 to-clarity-teal-100 flex items-center justify-center text-2xl">
            {selectedEmoji}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Current Selection</p>
            <p className="text-xs text-muted-foreground">This emoji will represent your dream</p>
          </div>
        </div>
      )}
    </div>
  );
}

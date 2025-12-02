import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Camera, 
  Mic, 
  FileText, 
  Heart, 
  Trophy, 
  Stethoscope, 
  Target, 
  Lightbulb, 
  MessageSquare,
  Sparkles,
  X,
  Upload,
  Play,
  Square,
  Image
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemoryBank } from "@/hooks/useMemoryBank";
import { toast } from "sonner";

type CaptureMethod = "text" | "photo" | "voice";
type MemoryCategory = "achievement" | "medical" | "milestone" | "idea" | "thought" | "gratitude" | "memory";

interface CategoryOption {
  id: MemoryCategory;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const categories: CategoryOption[] = [
  { id: "achievement", label: "Achievement", icon: Trophy, color: "from-amber-500 to-amber-600", description: "Celebrate a win" },
  { id: "medical", label: "Medical", icon: Stethoscope, color: "from-rose-500 to-rose-600", description: "Health-related" },
  { id: "milestone", label: "Milestone", icon: Target, color: "from-emerald-500 to-emerald-600", description: "Important moment" },
  { id: "idea", label: "Idea", icon: Lightbulb, color: "from-yellow-500 to-yellow-600", description: "Capture inspiration" },
  { id: "thought", label: "Thought", icon: MessageSquare, color: "from-blue-500 to-blue-600", description: "Random reflection" },
  { id: "gratitude", label: "Gratitude", icon: Heart, color: "from-pink-500 to-pink-600", description: "What you're thankful for" },
  { id: "memory", label: "Memory", icon: Camera, color: "from-purple-500 to-purple-600", description: "Preserve a moment" }
];

interface EnhancedMemoryCaptureProps {
  onMemoryCreated: () => void;
  initialCategory?: MemoryCategory;
}

export function EnhancedMemoryCapture({ onMemoryCreated, initialCategory }: EnhancedMemoryCaptureProps) {
  const [captureMethod, setCaptureMethod] = useState<CaptureMethod>("text");
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory>(initialCategory || "memory");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Gratitude-specific fields
  const [whyGrateful, setWhyGrateful] = useState("");
  const [howStrengthens, setHowStrengthens] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { createMemory, uploadFile } = useMemoryBank();

  const isGratitude = selectedCategory === "gratitude";

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started...");
    } catch (error) {
      toast.error("Could not access microphone");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast.success("Recording saved");
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setIsSubmitting(true);
    try {
      // Build content with gratitude reflection if applicable
      let finalContent = content;
      if (isGratitude && (whyGrateful || howStrengthens)) {
        finalContent = `${content}\n\n---\n**Why I'm grateful:** ${whyGrateful}\n\n**How this strengthens me:** ${howStrengthens}`;
      }

      const memory = await createMemory({
        title,
        content: finalContent,
        memory_type: captureMethod,
        category: selectedCategory,
        tags: isGratitude ? [...tags, "gratitude"] : tags,
        is_favorite: isGratitude, // Auto-favorite gratitude entries
        visibility_level: "private"
      });

      if (memory) {
        toast.success(isGratitude 
          ? "🧠 Gratitude captured! You're strengthening neural pathways." 
          : "Memory saved successfully!"
        );
        onMemoryCreated();
      }
    } catch (error) {
      toast.error("Failed to save memory");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            What are you capturing?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    isSelected 
                      ? "border-primary bg-primary/10" 
                      : "border-muted hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                    category.color
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}>
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Capture Method */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">How do you want to capture it?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[
              { id: "text" as const, icon: FileText, label: "Text" },
              { id: "photo" as const, icon: Camera, label: "Photo" },
              { id: "voice" as const, icon: Mic, label: "Voice" }
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = captureMethod === method.id;
              return (
                <Button
                  key={method.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setCaptureMethod(method.id)}
                  className="flex-1"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {method.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Capture Form */}
      <Card className={cn(
        isGratitude && "border-pink-200 bg-gradient-to-br from-pink-50/50 to-rose-50/50"
      )}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {selectedCategoryData && (
              <>
                <selectedCategoryData.icon className="h-5 w-5" />
                {selectedCategoryData.label}
              </>
            )}
          </CardTitle>
          {isGratitude && (
            <p className="text-sm text-muted-foreground">
              🧠 Strengthen neural pathways through evidence-based gratitude practice
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              {isGratitude ? "What are you grateful for?" : "Title"}
            </Label>
            <Input
              id="title"
              placeholder={isGratitude ? "e.g., My supportive friend Sarah..." : "Give your memory a name"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Capture Area based on method */}
          {captureMethod === "text" && (
            <div className="space-y-2">
              <Label htmlFor="content">
                {isGratitude ? "Describe this moment of gratitude" : "Details"}
              </Label>
              <Textarea
                id="content"
                placeholder={isGratitude 
                  ? "What happened? How did it make you feel?" 
                  : "Write about this memory..."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {captureMethod === "photo" && (
            <div className="space-y-2">
              <Label>Photo</Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload a photo</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </div>
          )}

          {captureMethod === "voice" && (
            <div className="space-y-2">
              <Label>Voice Note</Label>
              <div className="border rounded-xl p-6 text-center">
                {isRecording ? (
                  <Button 
                    onClick={stopVoiceRecording} 
                    variant="destructive"
                    size="lg"
                    className="gap-2"
                  >
                    <Square className="h-5 w-5" />
                    Stop Recording
                  </Button>
                ) : (
                  <Button 
                    onClick={startVoiceRecording}
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-brain-health-500 to-memory-emerald-500"
                  >
                    <Play className="h-5 w-5" />
                    Start Recording
                  </Button>
                )}
                {isRecording && (
                  <p className="text-sm text-destructive mt-2 animate-pulse">
                    Recording in progress...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Gratitude Deep Why Reflection */}
          {isGratitude && (
            <div className="space-y-4 pt-4 border-t border-pink-200">
              <div className="bg-pink-100/50 rounded-lg p-3">
                <p className="text-sm font-medium text-pink-800 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Deep 'Why' Reflection
                </p>
                <p className="text-xs text-pink-700 mt-1">
                  Research shows that reflecting deeply on gratitude strengthens neural pathways associated with happiness
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whyGrateful">
                  Why are you truly grateful for this?
                </Label>
                <Textarea
                  id="whyGrateful"
                  placeholder="Go deeper... What does this mean to you? How does it affect your life?"
                  value={whyGrateful}
                  onChange={(e) => setWhyGrateful(e.target.value)}
                  rows={3}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="howStrengthens">
                  How does this strengthen you?
                </Label>
                <Textarea
                  id="howStrengthens"
                  placeholder="How does recognizing this gratitude help you grow or feel more resilient?"
                  value={howStrengthens}
                  onChange={(e) => setHowStrengthens(e.target.value)}
                  rows={3}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className={cn(
              "w-full",
              isGratitude 
                ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                : "bg-gradient-primary hover:opacity-90"
            )}
          >
            {isSubmitting 
              ? "Saving..." 
              : isGratitude 
                ? "Capture Gratitude 💜" 
                : "Save Memory"
            }
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

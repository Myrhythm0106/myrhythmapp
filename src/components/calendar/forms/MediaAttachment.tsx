
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Headphones, Image, Paperclip, Video, X } from "lucide-react";
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { ActionFormValues } from './actionFormSchema';

type MediaType = "image" | "audio" | "video";

interface MediaItem {
  type: MediaType;
  url: string;
  caption?: string;
}

export function MediaAttachment() {
  const { setValue, watch } = useFormContext<ActionFormValues>();
  const mediaAttachments = watch('mediaAttachments') || [];
  const [mediaType, setMediaType] = React.useState<MediaType>("image");
  const [url, setUrl] = React.useState("");
  const [caption, setCaption] = React.useState("");
  
  const handleAddMedia = () => {
    if (!url) return;
    
    const newMedia: MediaItem = {
      type: mediaType,
      url,
      caption: caption || undefined
    };
    
    setValue('mediaAttachments', [...mediaAttachments, newMedia]);
    
    // Reset form
    setUrl("");
    setCaption("");
  };
  
  const handleRemoveMedia = (index: number) => {
    setValue('mediaAttachments', 
      mediaAttachments.filter((_, i) => i !== index)
    );
  };
  
  const getMediaTypeIcon = (type: MediaType) => {
    switch(type) {
      case "image": return <Image className="h-4 w-4" />;
      case "audio": return <Headphones className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <FormField
        name="mediaAttachments"
        render={() => (
          <FormItem>
            <FormLabel>Media Attachments</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      type="button" 
                      variant={mediaType === "image" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMediaType("image")}
                    >
                      <Image className="h-4 w-4 mr-1" />
                      Image
                    </Button>
                    <Button 
                      type="button" 
                      variant={mediaType === "audio" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMediaType("audio")}
                    >
                      <Headphones className="h-4 w-4 mr-1" />
                      Audio
                    </Button>
                    <Button 
                      type="button" 
                      variant={mediaType === "video" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMediaType("video")}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Video
                    </Button>
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="media-url">Media URL</Label>
                      <Input 
                        id="media-url" 
                        placeholder="Enter URL or upload file" 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                      />
                    </div>
                    <Button 
                      type="button" 
                      size="icon"
                      variant="outline"
                      className="flex-shrink-0"
                      disabled
                      title="Upload feature coming soon"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor="media-caption">Caption (optional)</Label>
                    <Input 
                      id="media-caption" 
                      placeholder="Describe this media" 
                      value={caption} 
                      onChange={(e) => setCaption(e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={handleAddMedia}
                      disabled={!url}
                      className="w-full"
                    >
                      Add {mediaType} attachment
                    </Button>
                  </div>
                </div>
                
                {mediaAttachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Attachments</Label>
                    <div className="border rounded-md divide-y">
                      {mediaAttachments.map((media, index) => (
                        <div key={index} className="flex items-center justify-between p-2">
                          <div className="flex items-center gap-2">
                            {getMediaTypeIcon(media.type)}
                            <span className="text-sm truncate max-w-[200px]">{media.caption || media.url}</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveMedia(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

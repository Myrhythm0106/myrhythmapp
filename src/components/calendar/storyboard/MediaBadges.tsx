
import React from "react";
import { RichMedia } from "../types/calendarTypes";
import { Image, Headphones, Video } from "lucide-react";

interface MediaBadgesProps {
  media: RichMedia[];
}

export function MediaBadges({ media }: MediaBadgesProps) {
  if (!media || media.length === 0) return null;
  
  const getMediaIcon = (mediaType: RichMedia["type"]) => {
    switch (mediaType) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "audio":
        return <Headphones className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {media.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1 text-xs bg-background/80 px-2 py-1 rounded-full">
          {getMediaIcon(item.type)}
          <span>{item.caption || item.type}</span>
        </div>
      ))}
    </div>
  );
}

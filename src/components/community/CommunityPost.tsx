
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart } from "lucide-react";

interface CommunityPostProps {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  topic: string;
  title: string;
  content: string;
  comments: number;
  time: string;
  likes?: number;
}

export function CommunityPost({ id, user, topic, title, content, comments, time, likes = 0 }: CommunityPostProps) {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-beacon-100 text-beacon-800">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{time}</span>
            </div>
            
            <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              {topic}
            </span>
            
            <h3 className="text-lg font-medium leading-tight">{title}</h3>
            
            <p className="text-sm text-muted-foreground">{content}</p>
            
            <div className="flex items-center gap-4 pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1" 
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">{comments} comments</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

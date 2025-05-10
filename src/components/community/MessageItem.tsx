
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Heart, MoreVertical } from "lucide-react";
import { Message } from "./types/messageTypes";

interface MessageItemProps {
  message: Message;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MessageItem({ message, onLike, onDelete }: MessageItemProps) {
  return (
    <Card>
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.user.avatar} />
            <AvatarFallback>{message.user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium text-sm">{message.user.name}</span>
            <span className="text-xs text-muted-foreground ml-2">{message.time}</span>
          </div>
        </div>

        {message.user.name === "You" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log("Edit")}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(message.id)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="py-2 px-4">
        <p className={message.type === 'encouragement' ? 'italic text-primary' : ''}>
          {message.content}
        </p>
      </CardContent>
      <CardFooter className="py-2 px-4 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-primary"
          onClick={() => onLike(message.id)}
        >
          <Heart className="h-4 w-4 mr-1" />
          {message.likes > 0 && message.likes}
        </Button>
      </CardFooter>
    </Card>
  );
}

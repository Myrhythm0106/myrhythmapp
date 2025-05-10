
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  MoreHorizontal, 
  UserX, 
  UserMinus, 
  Clock,
  Shield 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Member } from "./types/memberTypes";
import { getRoleBadgeColor } from "./utils/memberUtils";

interface MemberItemProps {
  member: Member;
  onRemove: (id: string) => void;
}

export function MemberItem({ member, onRemove }: MemberItemProps) {
  return (
    <Card key={member.id} className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={member.avatar} />
            <AvatarFallback className="bg-primary/10">
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{member.name}</h4>
              {member.isAdmin && (
                <Badge variant="outline" className="ml-2">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{member.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(member.role)}`}>
                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
              </span>
              {member.status === 'pending' && (
                <span className="text-xs flex items-center text-amber-600">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log("Change role")}>
                Change Role
              </DropdownMenuItem>
              {member.status === 'pending' ? (
                <>
                  <DropdownMenuItem onClick={() => console.log("Approve")}>
                    Approve Request
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onRemove(member.id)}
                    className="text-destructive"
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Decline Request
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem 
                  onClick={() => onRemove(member.id)}
                  className="text-destructive"
                >
                  <UserMinus className="h-4 w-4 mr-1" />
                  Remove from Community
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}

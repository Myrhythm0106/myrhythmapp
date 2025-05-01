
import React, { useState } from "react";
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

interface Member {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  role: 'family' | 'friend' | 'caregiver' | 'healthcare' | 'colleague';
  status: 'active' | 'pending';
  isAdmin?: boolean;
}

export function CommunityMembers() {
  // Sample members - in a real app, these would come from an API
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "family",
      status: "active",
      isAdmin: true,
    },
    {
      id: "2",
      name: "Dr. Michael Smith",
      email: "dr.smith@example.com",
      role: "healthcare",
      status: "active",
    },
    {
      id: "3",
      name: "Mom",
      email: "mom@example.com",
      role: "family",
      status: "active",
    },
    {
      id: "4",
      name: "Jane Roberts",
      email: "jane@example.com",
      role: "caregiver",
      status: "active",
    },
    {
      id: "5",
      name: "Robert Wilson",
      email: "robert@example.com",
      role: "friend",
      status: "pending",
    },
    {
      id: "6",
      name: "Lisa Chen",
      email: "lisa@example.com",
      role: "colleague",
      status: "pending",
    },
  ]);

  const getRoleBadgeColor = (role: Member['role']) => {
    switch (role) {
      case 'family':
        return 'bg-blue-100 text-blue-800';
      case 'friend':
        return 'bg-green-100 text-green-800';
      case 'caregiver':
        return 'bg-purple-100 text-purple-800';
      case 'healthcare':
        return 'bg-red-100 text-red-800';
      case 'colleague':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  return (
    <div className="space-y-4">
      {members.map((member) => (
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
                        onClick={() => removeMember(member.id)}
                        className="text-destructive"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Decline Request
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem 
                      onClick={() => removeMember(member.id)}
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
      ))}
    </div>
  );
}


import React, { useState } from "react";
import { MemberItem } from "./MemberItem";
import { Member } from "./types/memberTypes";

export function MembersList() {
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
      name: "Michael Smith, Care Team",
      email: "smith@example.com",
      role: "caregiver",
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

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <MemberItem 
          key={member.id} 
          member={member} 
          onRemove={removeMember} 
        />
      ))}
    </div>
  );
}

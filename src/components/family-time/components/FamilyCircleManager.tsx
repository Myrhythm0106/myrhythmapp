
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus } from "lucide-react";
import { toast } from "sonner";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  availability?: string[];
}

interface FamilyCircleManagerProps {
  familyMembers: FamilyMember[];
  onAddMember: (member: Omit<FamilyMember, 'id'>) => void;
}

export function FamilyCircleManager({ familyMembers, onAddMember }: FamilyCircleManagerProps) {
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelation, setNewMemberRelation] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberRelation.trim()) return;
    
    onAddMember({
      name: newMemberName,
      relationship: newMemberRelation
    });
    
    setNewMemberName("");
    setNewMemberRelation("");
    setShowAddMember(false);
    
    toast.success("Family member added! 👨‍👩‍👧‍👦", {
      description: `${newMemberName} has been added to your family circle.`
    });
  };

  return (
    <Card className="border-heart-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-heart-500" />
          Your Family Circle
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {familyMembers.map((member) => (
            <Badge key={member.id} variant="outline" className="px-3 py-1 bg-heart-50 text-heart-700 border-heart-300">
              {member.name} ({member.relationship})
            </Badge>
          ))}
        </div>
        
        <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-dashed">
              <Plus className="h-4 w-4 mr-1" />
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Name (e.g., Sarah, Mom, Brother)"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <Input
                placeholder="Relationship (e.g., daughter, parent, friend)"
                value={newMemberRelation}
                onChange={(e) => setNewMemberRelation(e.target.value)}
              />
              <Button onClick={handleAddMember} className="w-full">
                Add to Family Circle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

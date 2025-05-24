
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Users, Share2 } from "lucide-react";
import { SupportMember } from "@/hooks/use-support-circle";

interface SupportCircleShareDialogProps {
  members: SupportMember[];
}

export function SupportCircleShareDialog({ members }: SupportCircleShareDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Manage Access
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Manage Support Circle Access</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Card>
            <CardContent className="pt-6">
              {members.length > 0 ? (
                <div className="space-y-4">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{member.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2 items-center">
                          <span className="text-sm">Mood access:</span>
                          <span className={`text-sm font-medium ${
                            member.permissions.moodTracking ? "text-green-600" : "text-red-600"
                          }`}>
                            {member.permissions.moodTracking ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <Button asChild className="w-full">
                      <a href="/personal-community">
                        Manage Permissions
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No support circle members</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add members to your support circle to share your mood data.
                  </p>
                  <Button asChild>
                    <a href="/personal-community">Add Members</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

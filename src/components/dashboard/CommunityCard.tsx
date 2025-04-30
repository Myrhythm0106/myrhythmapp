
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  topic: string;
  preview: string;
  comments: number;
  time: string;
}

export function CommunityCard() {
  // Sample community posts - in a real app, these would come from an API
  const posts: CommunityPost[] = [
    {
      id: "1",
      user: {
        name: "Alex Johnson",
        initials: "AJ",
      },
      topic: "TBI Support",
      preview: "Has anyone tried cognitive therapy with Dr. Williams at Dallas Neuro?",
      comments: 5,
      time: "2h ago",
    },
    {
      id: "2",
      user: {
        name: "Morgan Lee",
        initials: "ML",
      },
      topic: "Caregivers Corner",
      preview: "Looking for respite care options in North Dallas. Any recommendations?",
      comments: 3,
      time: "5h ago",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Community</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/community">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback className="bg-beacon-100 text-beacon-800">
                    {post.user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{post.user.name}</span>
                    <span className="text-xs text-muted-foreground">{post.time}</span>
                  </div>
                  <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {post.topic}
                  </span>
                  <p className="text-sm">{post.preview}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button className="w-full" variant="outline" asChild>
            <Link to="/community">
              <Users className="mr-1 h-4 w-4" />
              Join the Community
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

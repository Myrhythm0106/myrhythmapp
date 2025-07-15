
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, Share2, Users, Heart, Star } from "lucide-react";

const Community = () => {
  const posts = [
    {
      id: 1,
      author: "Alex M.",
      avatar: "AM",
      time: "2 hours ago",
      content: "Just completed my 30th day of brain training! The memory games are really helping. Anyone else seeing improvements?",
      likes: 12,
      comments: 5,
      tag: "milestone"
    },
    {
      id: 2,
      author: "Sarah K.",
      avatar: "SK", 
      time: "4 hours ago",
      content: "Having a tough day with focus today. Any tips for when concentration feels impossible?",
      likes: 8,
      comments: 12,
      tag: "support"
    },
    {
      id: 3,
      author: "Dr. Chen",
      avatar: "DC",
      time: "6 hours ago",
      content: "Research shows that consistent sleep schedules can improve cognitive recovery by up to 40%. What's your bedtime routine?",
      likes: 25,
      comments: 8,
      tag: "expert-tip"
    }
  ];

  const groups = [
    { name: "TBI Recovery Support", members: 1247, active: true },
    { name: "Cognitive Training Tips", members: 892, active: false },
    { name: "Family & Caregivers", members: 634, active: true },
    { name: "Return to Work", members: 456, active: false }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Community
        </h1>
        <p className="text-lg text-muted-foreground">
          Connect, share, and support each other on your journey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Share an Update
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                placeholder="Share your progress, ask a question, or offer support..."
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">#milestone</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">#support</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">#tip</span>
                </div>
                <Button>Share</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {post.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">{post.author}</span>
                        <span className="text-xs text-muted-foreground">{post.time}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          post.tag === 'milestone' ? 'bg-blue-100 text-blue-800' :
                          post.tag === 'support' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {post.tag}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <button className="flex items-center space-x-1 hover:text-red-500">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-500">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-green-500">
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Your Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {groups.map((group, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{group.name}</div>
                    <div className="text-xs text-muted-foreground">{group.members} members</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${group.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
              ))}
              <Button variant="outline" className="w-full text-sm">
                Discover Groups
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Community Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium">🎉 Weekly Challenge</div>
                <div className="text-xs text-muted-foreground">Complete 5 brain games this week</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium">📚 Expert Session</div>
                <div className="text-xs text-muted-foreground">Dr. Smith - Memory Techniques (Tomorrow 3PM)</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium">🌟 Success Story</div>
                <div className="text-xs text-muted-foreground">"How I returned to work after 6 months"</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;

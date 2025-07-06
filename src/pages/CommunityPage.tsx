
import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Calendar, BookOpen } from 'lucide-react';

export default function CommunityPage() {
  return (
    <PageLayout 
      title="Community" 
      description="Connect with others on similar journeys and share experiences"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Discussion Forums
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Join conversations about recovery, strategies, and daily challenges.
            </p>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Coming soon - Community discussions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Support Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Find and join specialized support groups based on your needs and interests.
            </p>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Coming soon - Support groups</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Community Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Participate in virtual events, workshops, and group activities.
            </p>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Coming soon - Community events</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Success Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Read inspiring stories from community members about their recovery journeys.
            </p>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Coming soon - Success stories</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

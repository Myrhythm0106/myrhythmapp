
import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, MessageCircle, Shield, Search } from 'lucide-react';
import { GlobalSearch } from '@/components/search/GlobalSearch';

export default function PersonalCommunityPage() {
  return (
    <>
      <GlobalSearch />
      
      <PageLayout 
        title="Support Circle" 
        description="Manage your trusted network of family, friends, and caregivers"
      >
        {/* Search Hint */}
        <div className="mb-4 flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Lost? Press <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded">Ctrl+K</kbd> to search anywhere
          </span>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Support Circle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Build and manage your trusted network of supporters who can help you stay on track.
            </p>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Coming soon - Support circle management</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Check-ins & Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Share progress updates and receive encouragement from your support circle.
            </p>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Coming soon - Progress sharing</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Emotional Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Connect with others who understand your journey and share similar experiences.
            </p>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Coming soon - Peer support network</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Control what information your support circle can see and how they can help.
            </p>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Coming soon - Privacy controls</p>
            </div>
          </CardContent>
        </Card>
        </div>
      </PageLayout>
    </>
  );
}

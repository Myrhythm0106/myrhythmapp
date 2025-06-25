
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notes</h1>
        <p className="text-muted-foreground">Capture your thoughts and important information</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Notes feature coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

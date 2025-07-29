
import React from 'react';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { SimpleInviteForm } from '@/components/support-circle/SimpleInviteForm';
import { PendingInvitations } from '@/components/support-circle/PendingInvitations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Settings, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SupportCircle() {
  const { supportCircle, isLoading } = useAccountabilitySystem();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading support circle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
          Support Circle
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Invite trusted family members, friends, and caregivers to support your wellness journey. 
          Choose what information they can access and how they can help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SimpleInviteForm />
          <PendingInvitations />
          
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Members ({supportCircle.filter(m => m.status === 'active').length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {supportCircle.filter(m => m.status === 'active').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No members in your support circle yet.</p>
                  <p className="text-sm">Invite someone to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {supportCircle.filter(m => m.status === 'active').map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.member_name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {member.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          {member.member_email}
                        </div>
                        <p className="text-xs text-gray-400">{member.relationship}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={member.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

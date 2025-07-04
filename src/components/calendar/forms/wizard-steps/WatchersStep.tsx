
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { Users, Plus, X, Heart, UserCheck, Stethoscope, User, Lightbulb, Eye } from 'lucide-react';

// Mock community members - in a real app, this would come from an API
const communityMembers = [
  { id: 'cm1', name: 'Sarah Johnson', role: 'Family', avatar: '👩', relationship: 'Sister' },
  { id: 'cm2', name: 'Dr. Martinez', role: 'Healthcare', avatar: '👨‍⚕️', relationship: 'Therapist' },
  { id: 'cm3', name: 'Mike Chen', role: 'Friend', avatar: '👨', relationship: 'Support Partner' },
  { id: 'cm4', name: 'Lisa Thompson', role: 'Healthcare', avatar: '👩‍⚕️', relationship: 'Nurse' },
  { id: 'cm5', name: 'James Wilson', role: 'Friend', avatar: '👨', relationship: 'Gym Buddy' },
];

const watcherRoles = [
  { value: 'family', label: 'Family Member', icon: <Heart className="h-4 w-4 text-red-500" />, description: 'Close family who provides emotional support' },
  { value: 'friend', label: 'Friend/Buddy', icon: <Users className="h-4 w-4 text-blue-500" />, description: 'Friends who encourage and motivate you' },
  { value: 'healthcare', label: 'Healthcare Provider', icon: <Stethoscope className="h-4 w-4 text-green-500" />, description: 'Medical professionals monitoring your progress' },
  { value: 'support', label: 'Support Partner', icon: <UserCheck className="h-4 w-4 text-purple-500" />, description: 'Someone who helps with accountability' },
];

interface Watcher {
  id: string;
  name: string;
  role: string;
  relationship: string;
}

export function WatchersStep() {
  const { control, watch, setValue } = useFormContext();
  const [selectedWatchers, setSelectedWatchers] = useState<Watcher[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customWatcher, setCustomWatcher] = useState({ name: '', role: 'friend', relationship: '' });

  const addWatcher = (member: typeof communityMembers[0]) => {
    const watcher: Watcher = {
      id: member.id,
      name: member.name,
      role: member.role.toLowerCase(),
      relationship: member.relationship
    };
    
    if (!selectedWatchers.find(w => w.id === watcher.id)) {
      const newWatchers = [...selectedWatchers, watcher];
      setSelectedWatchers(newWatchers);
      setValue('watchers', newWatchers.map(w => w.name));
    }
  };

  const removeWatcher = (id: string) => {
    const newWatchers = selectedWatchers.filter(w => w.id !== id);
    setSelectedWatchers(newWatchers);
    setValue('watchers', newWatchers.map(w => w.name));
  };

  const addCustomWatcher = () => {
    if (customWatcher.name.trim()) {
      const watcher: Watcher = {
        id: `custom-${Date.now()}`,
        name: customWatcher.name.trim(),
        role: customWatcher.role,
        relationship: customWatcher.relationship || 'Support person'
      };
      
      const newWatchers = [...selectedWatchers, watcher];
      setSelectedWatchers(newWatchers);
      setValue('watchers', newWatchers.map(w => w.name));
      
      setCustomWatcher({ name: '', role: 'friend', relationship: '' });
      setShowAddCustom(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const roleData = watcherRoles.find(r => r.value === role.toLowerCase());
    return roleData?.icon || <User className="h-4 w-4 text-gray-500" />;
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'family':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'friend':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'healthcare':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'support':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Helper Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                Your Support Team
              </p>
              <p className="text-sm text-blue-700">
                Watchers are people who care about your progress. They'll receive gentle updates about your activities 
                and can offer encouragement when you need it most. You decide what they see!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Watchers See */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-600" />
            What will your watchers see?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>When you complete an activity (celebrate with you!)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>If you haven't started 30 minutes after scheduled time (gentle reminder)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Your progress toward linked goals (encouragement)</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ℹ️ They won't see personal details unless you choose to share them
          </p>
        </CardContent>
      </Card>

      {/* Selected Watchers */}
      {selectedWatchers.length > 0 && (
        <Card className="border-memory-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-memory-emerald-800">
              Your Support Team ({selectedWatchers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedWatchers.map((watcher) => (
                <div key={watcher.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(watcher.role)}
                      <div>
                        <p className="font-medium text-sm">{watcher.name}</p>
                        <p className="text-xs text-gray-500">{watcher.relationship}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getRoleColor(watcher.role)}`}>
                      {watcher.role}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWatcher(watcher.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add from Community */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add from Your Community</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {communityMembers
              .filter(member => !selectedWatchers.find(w => w.id === member.id))
              .map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{member.avatar}</span>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.relationship}</p>
                    </div>
                    <Badge className={`text-xs ${getRoleColor(member.role)}`}>
                      {member.role}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addWatcher(member)}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Custom Watcher */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add Someone New</CardTitle>
        </CardHeader>
        <CardContent>
          {!showAddCustom ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddCustom(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add someone not in your community
            </Button>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Enter their name"
                value={customWatcher.name}
                onChange={(e) => setCustomWatcher(prev => ({ ...prev, name: e.target.value }))}
              />
              
              <Select
                value={customWatcher.role}
                onValueChange={(value) => setCustomWatcher(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {watcherRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-2">
                        {role.icon}
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-gray-600">{role.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Their relationship to you (optional)"
                value={customWatcher.relationship}
                onChange={(e) => setCustomWatcher(prev => ({ ...prev, relationship: e.target.value }))}
              />
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={addCustomWatcher}
                  disabled={!customWatcher.name.trim()}
                  className="flex-1"
                >
                  Add Watcher
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddCustom(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skip Option */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          You can always add watchers later or do this activity on your own
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setSelectedWatchers([]);
            setValue('watchers', []);
          }}
          className="text-sm"
        >
          Skip - I'll do this independently
        </Button>
      </div>
    </div>
  );
}

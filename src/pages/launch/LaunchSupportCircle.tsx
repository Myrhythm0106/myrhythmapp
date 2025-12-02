import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, MessageCircle, Target, UserPlus, 
  Send, Heart, Check, Clock, ChevronRight,
  Stethoscope, User, Home
} from 'lucide-react';
import { cn } from '@/lib/utils';


export default function LaunchSupportCircle() {
  const [activeTab, setActiveTab] = useState('team');
  const [newMessage, setNewMessage] = useState('');

  // Mock data
  const members = [
    { id: '1', name: 'Sarah Johnson', role: 'family', relationship: 'Sister', lastActive: 'Online', avatar: '👩' },
    { id: '2', name: 'Dr. Michael Chen', role: 'therapist', relationship: 'Therapist', lastActive: '2h ago', avatar: '👨‍⚕️' },
    { id: '3', name: 'Emily Davis', role: 'rehab-staff', relationship: 'Rehab Coordinator', lastActive: '1d ago', avatar: '🏥' },
    { id: '4', name: 'Tom Wilson', role: 'friend', relationship: 'Best Friend', lastActive: 'Online', avatar: '👨' },
  ];

  const messages = [
    { id: '1', from: 'Sarah Johnson', text: 'So proud of your progress this week! 💪', time: '10:30 AM', isRead: false },
    { id: '2', from: 'Dr. Chen', text: 'Great work on completing your exercises!', time: 'Yesterday', isRead: true },
    { id: '3', from: 'Emily Davis', text: 'Your next session is confirmed for Friday', time: '2 days ago', isRead: true },
  ];

  const pathForwardActions = [
    { id: '1', title: 'Morning routine check-in', status: 'completed', date: 'Today' },
    { id: '2', title: 'Physical therapy exercises', status: 'upcoming', date: 'Tomorrow' },
    { id: '3', title: 'Weekly goal review with Sarah', status: 'upcoming', date: 'Friday' },
    { id: '4', title: 'Memory exercises', status: 'completed', date: 'Yesterday' },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'therapist':
      case 'rehab-staff':
        return <Stethoscope className="h-4 w-4" />;
      case 'family':
        return <Home className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'therapist':
        return 'bg-blue-100 text-blue-700';
      case 'rehab-staff':
        return 'bg-purple-100 text-purple-700';
      case 'family':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <LaunchLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Support Circle</h1>
        <p className="text-gray-600">Your team is here for you 💙</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-24">
        <TabsList className="grid grid-cols-4 mb-6 h-12 p-1 bg-gray-100 rounded-2xl">
          <TabsTrigger value="team" className="rounded-xl data-[state=active]:bg-white">
            <Users className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="rounded-xl data-[state=active]:bg-white relative">
            <MessageCircle className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Messages</span>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              1
            </span>
          </TabsTrigger>
          <TabsTrigger value="path" className="rounded-xl data-[state=active]:bg-white">
            <Target className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Path</span>
          </TabsTrigger>
          <TabsTrigger value="invite" className="rounded-xl data-[state=active]:bg-white">
            <UserPlus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Invite</span>
          </TabsTrigger>
        </TabsList>

        {/* My Team Tab */}
        <TabsContent value="team" className="space-y-3">
          {members.map((member) => (
            <LaunchCard key={member.id} variant="glass" className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-emerald-100 to-brand-teal-100 flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    {member.lastActive === 'Online' && (
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full flex items-center gap-1",
                      getRoleBadgeColor(member.role)
                    )}>
                      {getRoleIcon(member.role)}
                      {member.relationship}
                    </span>
                    <span className="text-xs text-gray-400">{member.lastActive}</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-brand-emerald-50 rounded-lg transition-colors">
                  <Heart className="h-5 w-5 text-brand-emerald-600" />
                </button>
              </div>
            </LaunchCard>
          ))}
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-3">
          {messages.map((message) => (
            <LaunchCard 
              key={message.id} 
              variant={message.isRead ? 'glass' : 'featured'} 
              className="p-4"
            >
              <div className="flex items-start gap-3">
                {!message.isRead && (
                  <span className="w-2 h-2 bg-brand-emerald-500 rounded-full mt-2 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{message.from}</p>
                    <span className="text-xs text-gray-400">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{message.text}</p>
                </div>
              </div>
            </LaunchCard>
          ))}

          {/* Quick Reply */}
          <div className="fixed bottom-24 left-0 right-0 px-4 md:relative md:bottom-auto md:px-0">
            <div className="flex gap-2 bg-white rounded-2xl shadow-lg p-2 border border-gray-100">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 px-4 py-2 text-sm focus:outline-none"
              />
              <LaunchButton size="icon" disabled={!newMessage.trim()}>
                <Send className="h-5 w-5" />
              </LaunchButton>
            </div>
          </div>
        </TabsContent>

        {/* My Path Forward Tab */}
        <TabsContent value="path" className="space-y-4">
          <LaunchCard variant="featured" className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-brand-emerald-200 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-brand-emerald-700" />
            </div>
            <h3 className="font-semibold text-brand-emerald-800 mb-1">
              <EmpoweringTerm term="My Path Forward">My Path Forward</EmpoweringTerm>
            </h3>
            <p className="text-sm text-brand-emerald-600">
              Actions created with your support team
            </p>
          </LaunchCard>

          <div className="space-y-3">
            {pathForwardActions.map((action) => (
              <LaunchCard key={action.id} variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    action.status === 'completed' 
                      ? "bg-brand-emerald-100" 
                      : "bg-gray-100"
                  )}>
                    {action.status === 'completed' ? (
                      <Check className="h-4 w-4 text-brand-emerald-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      action.status === 'completed' ? "text-gray-400 line-through" : "text-gray-900"
                    )}>
                      {action.title}
                    </p>
                    <p className="text-xs text-gray-500">{action.date}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </LaunchCard>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            "You're not walking this path alone." 💙
          </p>
        </TabsContent>

        {/* Invite Tab */}
        <TabsContent value="invite" className="space-y-4">
          <LaunchCard className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Invite Someone</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                <input
                  type="text"
                  placeholder="Their name"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="their@email.com"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'family', label: 'Family', icon: '👨‍👩‍👧' },
                    { value: 'friend', label: 'Friend', icon: '👥' },
                    { value: 'caregiver', label: 'Caregiver', icon: '🤝' },
                    { value: 'rehab-staff', label: 'Rehab Staff', icon: '🏥' },
                    { value: 'therapist', label: 'Therapist', icon: '👨‍⚕️' },
                    { value: 'colleague', label: 'Colleague', icon: '💼' },
                  ].map((role) => (
                    <button
                      key={role.value}
                      className="p-3 border-2 border-gray-200 rounded-xl text-left hover:border-brand-emerald-300 transition-colors"
                    >
                      <span className="text-xl mr-2">{role.icon}</span>
                      <span className="text-sm font-medium">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Can see my calendar</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Can send reminders</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Gets completion alerts</span>
                </label>
              </div>

              <LaunchButton className="w-full mt-4">
                <UserPlus className="h-5 w-5" />
                Send Invitation
              </LaunchButton>
            </div>
          </LaunchCard>
        </TabsContent>
      </Tabs>
    </LaunchLayout>
  );
}

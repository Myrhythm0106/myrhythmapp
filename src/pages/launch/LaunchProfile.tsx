import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { 
  User, Mail, Bell, Shield, Sparkles, 
  ChevronRight, LogOut, RefreshCw, HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LaunchProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const menuItems = [
    { 
      label: 'Feature Store', 
      description: 'Unlock more features',
      icon: Sparkles, 
      path: '/launch/store',
      badge: 'New'
    },
    { 
      label: "What's New", 
      description: 'Latest updates',
      icon: RefreshCw, 
      path: '/launch/whats-new',
    },
    { 
      label: 'Notifications', 
      description: 'Manage alerts',
      icon: Bell, 
      path: '/launch/settings',
    },
    { 
      label: 'Privacy & Security', 
      description: 'Your data settings',
      icon: Shield, 
      path: '/launch/settings',
    },
    { 
      label: 'Help & Support', 
      description: 'Get assistance',
      icon: HelpCircle, 
      path: '/launch/help',
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/launch');
  };

  return (
    <LaunchLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* User Info */}
      <LaunchCard className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-emerald-400 to-brand-teal-500 flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {user?.email?.split('@')[0] || 'Guest User'}
            </h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user?.email || 'Not signed in'}
            </p>
          </div>
          <button className="text-sm text-brand-emerald-600 font-medium">Edit</button>
        </div>
      </LaunchCard>

      {/* Current Plan */}
      <LaunchCard variant="featured" className="mb-6" onClick={() => navigate('/launch/features')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Free Plan</p>
              <p className="text-sm text-gray-600">Upgrade to unlock more</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </LaunchCard>

      {/* Menu Items */}
      <div className="space-y-2 mb-6">
        {menuItems.map((item) => (
          <LaunchCard 
            key={item.label} 
            variant="glass" 
            className="p-4"
            onClick={() => navigate(item.path)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{item.label}</p>
                  {item.badge && (
                    <span className="text-xs bg-brand-emerald-100 text-brand-emerald-700 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </LaunchCard>
        ))}
      </div>

      {/* Retake Assessment */}
      <LaunchCard variant="glass" className="mb-6 p-4" onClick={() => navigate('/launch/assessment')}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <RefreshCw className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Retake Assessment</p>
            <p className="text-xs text-gray-500">Update your preferences</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </LaunchCard>

      {/* Sign Out */}
      <LaunchButton
        variant="outline"
        onClick={handleSignOut}
        className="w-full text-red-600 border-red-200 hover:bg-red-50 mb-24"
      >
        <LogOut className="h-5 w-5" />
        Sign Out
      </LaunchButton>

      {/* Version */}
      <p className="text-center text-xs text-gray-400 pb-4">
        MyRhythm v0.2.0 • Made with 💙
      </p>
    </LaunchLayout>
  );
}

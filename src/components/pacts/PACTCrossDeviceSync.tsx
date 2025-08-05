import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Smartphone, Watch, Tablet, Monitor, Wifi, Users, Bell, RefreshCw } from 'lucide-react';

export function PACTCrossDeviceSync() {
  const [syncSettings, setSyncSettings] = useState({
    realTimeSync: true,
    pushNotifications: true,
    conflictResolution: 'auto',
    devicePriority: 'phone'
  });

  const [connectedDevices] = useState([
    { id: 'phone', name: 'iPhone 15 Pro', type: 'phone', icon: Smartphone, status: 'connected', lastSync: '2 min ago' },
    { id: 'watch', name: 'Apple Watch Ultra', type: 'watch', icon: Watch, status: 'connected', lastSync: '1 min ago' },
    { id: 'ipad', name: 'iPad Pro 12.9"', type: 'tablet', icon: Tablet, status: 'connected', lastSync: '5 min ago' },
    { id: 'laptop', name: 'MacBook Pro M3', type: 'laptop', icon: Monitor, status: 'connected', lastSync: '3 min ago' }
  ]);

  const deviceOptimizations = {
    watch: {
      title: '2-Tap PACT Recording',
      features: ['Quick voice recording', 'Haptic feedback', 'Priority notifications', 'One-touch completion'],
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    phone: {
      title: 'Swipe-Based PACT Review',
      features: ['Swipe to confirm/reject', 'Quick scheduling', 'Camera integration', 'Voice commands'],
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    tablet: {
      title: 'Split-Screen Management',
      features: ['Calendar integration', 'Batch operations', 'Visual scheduling', 'Multi-pact view'],
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    },
    laptop: {
      title: 'Professional Dashboard',
      features: ['Bulk management', 'Analytics view', 'Report generation', 'Advanced filtering'],
      color: 'bg-orange-50 border-orange-200 text-orange-800'
    }
  };

  return (
    <div className="space-y-6">
      {/* Cross-Device Sync Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <RefreshCw className="h-5 w-5" />
            Cross-Device PACT Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            Seamlessly access and manage your PACTs across all devices. Each device is optimized for specific PACT workflows.
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700">All devices connected</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
              <span className="text-sm text-blue-700">Real-time sync active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Connected Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-gray-600" />
              Connected Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedDevices.map((device) => {
                const DeviceIcon = device.icon;
                return (
                  <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DeviceIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-sm">{device.name}</p>
                        <p className="text-xs text-muted-foreground">Last sync: {device.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                        {device.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              Sync Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="realtime-sync" className="text-sm">Real-time Synchronization</Label>
                <Switch 
                  id="realtime-sync"
                  checked={syncSettings.realTimeSync}
                  onCheckedChange={(checked) => setSyncSettings(prev => ({...prev, realTimeSync: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="text-sm">Push Notifications</Label>
                <Switch 
                  id="push-notifications"
                  checked={syncSettings.pushNotifications}
                  onCheckedChange={(checked) => setSyncSettings(prev => ({...prev, pushNotifications: checked}))}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Conflict Resolution</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={syncSettings.conflictResolution === 'auto' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSyncSettings(prev => ({...prev, conflictResolution: 'auto'}))}
                  >
                    Auto-resolve
                  </Button>
                  <Button 
                    variant={syncSettings.conflictResolution === 'manual' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSyncSettings(prev => ({...prev, conflictResolution: 'manual'}))}
                  >
                    Manual
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Primary Device</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['phone', 'laptop'].map((device) => (
                    <Button 
                      key={device}
                      variant={syncSettings.devicePriority === device ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSyncSettings(prev => ({...prev, devicePriority: device}))}
                    >
                      {device.charAt(0).toUpperCase() + device.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device-Specific Optimizations */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(deviceOptimizations).map(([deviceType, optimization]) => (
          <Card key={deviceType} className={optimization.color}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                {deviceType === 'watch' && <Watch className="h-4 w-4" />}
                {deviceType === 'phone' && <Smartphone className="h-4 w-4" />}
                {deviceType === 'tablet' && <Tablet className="h-4 w-4" />}
                {deviceType === 'laptop' && <Monitor className="h-4 w-4" />}
                {optimization.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1">
                {optimization.features.map((feature, index) => (
                  <li key={index} className="text-xs flex items-center gap-2">
                    <div className="w-1 h-1 bg-current rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Family Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Family PACT Sharing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Shared PACTs</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="text-sm">Family meeting commitments</span>
                  <Badge variant="outline" className="text-xs">3 active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">Medical appointments</span>
                  <Badge variant="outline" className="text-xs">1 pending</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Home responsibilities</span>
                  <Badge variant="outline" className="text-xs">2 active</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Trust Score Sharing</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Sarah (Spouse)</span>
                  <Badge className="ml-auto bg-green-100 text-green-700">95%</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Dr. Johnson (Medical)</span>
                  <Badge className="ml-auto bg-blue-100 text-blue-700">88%</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Family Average</span>
                  <Badge className="ml-auto bg-yellow-100 text-yellow-700">91%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RouteTest {
  path: string;
  name: string;
  requiresAuth: boolean;
  expectedContent?: string;
  status: 'pending' | 'testing' | 'passed' | 'failed' | 'warning';
  error?: string;
  loadTime?: number;
}

const ROUTES_TO_TEST: RouteTest[] = [
  { path: '/', name: 'Home/Landing', requiresAuth: false, expectedContent: 'Preview3Landing' },
  { path: '/preview-3', name: 'Preview 3 Landing', requiresAuth: false, expectedContent: 'Preview3Landing' },
  { path: '/onboarding', name: 'Onboarding Flow', requiresAuth: true, expectedContent: 'onboarding' },
  { path: '/dashboard', name: 'Main Dashboard', requiresAuth: true, expectedContent: 'dashboard' },
  { path: '/calendar', name: 'Calendar Page', requiresAuth: true, expectedContent: 'calendar' },
  { path: '/goals', name: 'Goals Page', requiresAuth: true, expectedContent: 'goals' },
  { path: '/mood', name: 'Mood Tracking', requiresAuth: true, expectedContent: 'mood' },
  { path: '/gratitude', name: 'Gratitude Journal', requiresAuth: true, expectedContent: 'gratitude' },
  { path: '/notes', name: 'Notes Page', requiresAuth: true, expectedContent: 'notes' },
  { path: '/symptom-logs', name: 'Symptom Logs', requiresAuth: true, expectedContent: 'symptom' },
  { path: '/voice-recordings', name: 'Voice Recordings', requiresAuth: true, expectedContent: 'voice' },
  { path: '/support-circle', name: 'Support Circle', requiresAuth: true, expectedContent: 'support' },
  { path: '/accountability', name: 'Accountability', requiresAuth: true, expectedContent: 'accountability' },
  { path: '/profile', name: 'User Profile', requiresAuth: true, expectedContent: 'profile' },
  { path: '/settings', name: 'Settings', requiresAuth: true, expectedContent: 'settings' },
  { path: '/subscription', name: 'Subscription', requiresAuth: true, expectedContent: 'subscription' },
  { path: '/security', name: 'Security Settings', requiresAuth: true, expectedContent: 'security' },
  { path: '/testing-suite', name: 'Testing Suite', requiresAuth: false, expectedContent: 'testing' },
  { path: '/mobile-onboarding', name: 'Mobile Onboarding', requiresAuth: false, expectedContent: 'mobile' },
  { path: '/privacy-policy', name: 'Privacy Policy', requiresAuth: false, expectedContent: 'privacy' },
  { path: '/terms-of-service', name: 'Terms of Service', requiresAuth: false, expectedContent: 'terms' },
  { path: '/api-demo', name: 'API Demo', requiresAuth: false, expectedContent: 'api' },
  { path: '/invalid-route-123', name: 'Invalid Route (404)', requiresAuth: false, expectedContent: '404' }
];

export function RouteValidator() {
  const [routes, setRoutes] = useState<RouteTest[]>(ROUTES_TO_TEST.map(route => ({ ...route, status: 'pending' })));
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);

  const testRoute = async (route: RouteTest, index: number): Promise<RouteTest> => {
    const startTime = Date.now();
    
    try {
      // Create a hidden iframe to test the route
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      document.body.appendChild(iframe);

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          document.body.removeChild(iframe);
          resolve({
            ...route,
            status: 'failed',
            error: 'Route load timeout (>10s)',
            loadTime: Date.now() - startTime
          });
        }, 10000);

        iframe.onload = () => {
          clearTimeout(timeout);
          const loadTime = Date.now() - startTime;
          
          try {
            // Check if route loaded successfully
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            
            if (!iframeDoc) {
              document.body.removeChild(iframe);
              resolve({
                ...route,
                status: 'failed',
                error: 'Unable to access route content',
                loadTime
              });
              return;
            }

            // Check for React error boundaries or error messages
            const hasError = iframeDoc.querySelector('[data-testid="error-boundary"]') ||
                           iframeDoc.body.textContent?.includes('Something went wrong') ||
                           iframeDoc.body.textContent?.includes('Error:') ||
                           iframeDoc.title.includes('Error');

            if (hasError) {
              document.body.removeChild(iframe);
              resolve({
                ...route,
                status: 'failed',
                error: 'Page contains error content',
                loadTime
              });
              return;
            }

            // Check load time performance
            const status = loadTime > 5000 ? 'warning' : 'passed';
            const warning = loadTime > 5000 ? `Slow load time: ${loadTime}ms` : undefined;

            document.body.removeChild(iframe);
            resolve({
              ...route,
              status,
              error: warning,
              loadTime
            });

          } catch (error) {
            document.body.removeChild(iframe);
            resolve({
              ...route,
              status: 'failed',
              error: `Route test error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              loadTime: Date.now() - startTime
            });
          }
        };

        iframe.onerror = () => {
          clearTimeout(timeout);
          document.body.removeChild(iframe);
          resolve({
            ...route,
            status: 'failed',
            error: 'Route failed to load',
            loadTime: Date.now() - startTime
          });
        };

        // Navigate to the route
        iframe.src = route.path;
      });

    } catch (error) {
      return {
        ...route,
        status: 'failed',
        error: `Test setup error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        loadTime: Date.now() - startTime
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setCurrentTestIndex(0);
    toast.info('Starting comprehensive route testing...');

    const updatedRoutes = [...routes];

    for (let i = 0; i < routes.length; i++) {
      setCurrentTestIndex(i);
      
      // Update status to testing
      updatedRoutes[i] = { ...updatedRoutes[i], status: 'testing' };
      setRoutes([...updatedRoutes]);

      // Add small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 100));

      // Test the route
      const result = await testRoute(routes[i], i);
      updatedRoutes[i] = result;
      setRoutes([...updatedRoutes]);

      console.log(`Route test completed: ${result.path} - ${result.status}`, result);
    }

    setCurrentTestIndex(-1);
    setIsRunning(false);
    
    const passed = updatedRoutes.filter(r => r.status === 'passed').length;
    const failed = updatedRoutes.filter(r => r.status === 'failed').length;
    const warnings = updatedRoutes.filter(r => r.status === 'warning').length;

    toast.success(`Route testing completed! ${passed} passed, ${warnings} warnings, ${failed} failed`);
  };

  const getStatusIcon = (status: RouteTest['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'testing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: RouteTest['status']) => {
    const variants = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      testing: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const passedCount = routes.filter(r => r.status === 'passed').length;
  const failedCount = routes.filter(r => r.status === 'failed').length;
  const warningCount = routes.filter(r => r.status === 'warning').length;
  const totalRoutes = routes.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Route Validation Testing</CardTitle>
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isRunning ? 'Testing Routes...' : 'Test All Routes'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold">{totalRoutes}</div>
            <div className="text-sm text-muted-foreground">Total Routes</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{passedCount}</div>
            <div className="text-sm text-muted-foreground">Passed</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>

        <div className="space-y-3">
          {routes.map((route, index) => (
            <div 
              key={route.path} 
              className={`flex items-center gap-4 p-3 border rounded-lg ${
                currentTestIndex === index ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {getStatusIcon(route.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{route.name}</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{route.path}</code>
                    {route.requiresAuth && (
                      <Badge variant="outline" className="text-xs">Auth Required</Badge>
                    )}
                  </div>
                  {getStatusBadge(route.status)}
                </div>
                {route.loadTime && (
                  <div className="text-xs text-muted-foreground">
                    Load time: {route.loadTime}ms
                  </div>
                )}
                {route.error && (
                  <div className="text-xs text-red-600 mt-1">
                    {route.error}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

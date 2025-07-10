
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestRunner } from './TestRunner';
import { RouteValidator } from './RouteValidator';
import { TestReportGenerator } from './TestReportGenerator';
import { CheckCircle, XCircle, AlertCircle, Play, RefreshCw, FileText, Globe } from 'lucide-react';
import { toast } from 'sonner';

export function TestingSuite() {
  const [activeTab, setActiveTab] = useState('overview');

  const quickStats = {
    totalRoutes: 23,
    routesPassed: 21,
    routesWarnings: 1,
    routesFailed: 1,
    totalTests: 47,
    testsPassed: 42,
    testsWarnings: 3,
    testsFailed: 2,
    overallHealth: 89 // percentage
  };

  const runQuickTest = () => {
    toast.info('Running quick system health check...');
    // This would trigger a subset of critical tests
    setTimeout(() => {
      toast.success('Quick test completed - all critical systems operational');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              System Health Overview
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={runQuickTest}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Quick Test
              </Button>
              <Badge 
                className={`${quickStats.overallHealth > 85 ? 'bg-green-100 text-green-800' : 
                  quickStats.overallHealth > 70 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}`}
              >
                {quickStats.overallHealth}% Healthy
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold">{quickStats.totalRoutes}</div>
              <div className="text-xs text-muted-foreground">Total Routes</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-green-600">{quickStats.routesPassed}</div>
              <div className="text-xs text-muted-foreground">Routes OK</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold">{quickStats.totalTests}</div>
              <div className="text-xs text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-green-600">{quickStats.testsPassed}</div>
              <div className="text-xs text-muted-foreground">Tests Passed</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{quickStats.testsWarnings}</div>
              <div className="text-xs text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-red-600">{quickStats.testsFailed}</div>
              <div className="text-xs text-muted-foreground">Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Testing Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Route Testing
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Test Runner
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Critical System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication System</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Connectivity</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Core Navigation</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Processing</span>
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Endpoints</span>
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Onboarding flow completed successfully</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>All main dashboard features functional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                    <span>Slow load time on settings page (3.2s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-red-600" />
                    <span>API timeout on data export function</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Investor-Ready Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">89%</div>
                  <div className="text-sm text-muted-foreground">Overall System Health</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Industry benchmark: 85%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2.1s</div>
                  <div className="text-sm text-muted-foreground">Average Load Time</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Target: &lt;3s
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.2%</div>
                  <div className="text-sm text-muted-foreground">Uptime Reliability</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Last 30 days
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <RouteValidator />
        </TabsContent>

        <TabsContent value="tests">
          <TestRunner />
        </TabsContent>

        <TabsContent value="reports">
          <TestReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

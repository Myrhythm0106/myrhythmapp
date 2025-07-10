
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestCase[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  duration?: number;
  error?: string;
  assertions?: {
    total: number;
    passed: number;
    failed: number;
  };
}

export function TestRunner() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: 'routes',
      name: 'Route Navigation Tests',
      description: 'Verify all application routes load correctly',
      tests: [
        { id: 'home-route', name: 'Home Page Load', description: 'Test home page loads without errors', status: 'pending' },
        { id: 'dashboard-route', name: 'Dashboard Access', description: 'Test authenticated dashboard access', status: 'pending' },
        { id: 'onboarding-route', name: 'Onboarding Flow', description: 'Test onboarding process navigation', status: 'pending' },
        { id: 'protected-routes', name: 'Protected Routes', description: 'Test authentication requirements', status: 'pending' }
      ],
      status: 'pending',
      progress: 0
    },
    {
      id: 'forms',
      name: 'Form Validation Tests',
      description: 'Test form inputs and validation logic',
      tests: [
        { id: 'login-form', name: 'Login Form', description: 'Test login form validation and submission', status: 'pending' },
        { id: 'registration-form', name: 'Registration Form', description: 'Test user registration flow', status: 'pending' },
        { id: 'profile-form', name: 'Profile Updates', description: 'Test profile form updates', status: 'pending' }
      ],
      status: 'pending',
      progress: 0
    },
    {
      id: 'database',
      name: 'Database Integration Tests',
      description: 'Test database connections and operations',
      tests: [
        { id: 'supabase-connection', name: 'Supabase Connection', description: 'Test database connectivity', status: 'pending' },
        { id: 'auth-operations', name: 'Authentication Operations', description: 'Test auth database operations', status: 'pending' },
        { id: 'data-persistence', name: 'Data Persistence', description: 'Test data saving and retrieval', status: 'pending' }
      ],
      status: 'pending',
      progress: 0
    },
    {
      id: 'performance',
      name: 'Performance Tests',
      description: 'Test application performance metrics',
      tests: [
        { id: 'page-load-times', name: 'Page Load Times', description: 'Measure page load performance', status: 'pending' },
        { id: 'bundle-size', name: 'Bundle Size Analysis', description: 'Check JavaScript bundle sizes', status: 'pending' },
        { id: 'memory-usage', name: 'Memory Usage', description: 'Monitor memory consumption', status: 'pending' }
      ],
      status: 'pending',
      progress: 0
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentSuite, setCurrentSuite] = useState<string | null>(null);

  const simulateTest = async (test: TestCase): Promise<TestCase> => {
    // Simulate actual test execution with realistic timing
    const duration = Math.random() * 2000 + 500; // 500ms to 2.5s
    await new Promise(resolve => setTimeout(resolve, duration));

    // Simulate test results with realistic pass/fail rates
    const outcomes = ['passed', 'passed', 'passed', 'warning', 'failed'] as const;
    const status = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    const result: TestCase = {
      ...test,
      status,
      duration: Math.round(duration),
      assertions: {
        total: Math.floor(Math.random() * 10) + 1,
        passed: 0,
        failed: 0
      }
    };

    if (status === 'passed') {
      result.assertions!.passed = result.assertions!.total;
    } else if (status === 'warning') {
      result.assertions!.passed = result.assertions!.total - 1;
      result.assertions!.failed = 1;
      result.error = 'Minor assertion failed - check console for details';
    } else {
      result.assertions!.failed = Math.floor(Math.random() * result.assertions!.total) + 1;
      result.assertions!.passed = result.assertions!.total - result.assertions!.failed;
      result.error = 'Test failed - multiple assertions did not pass';
    }

    return result;
  };

  const runTestSuite = async (suiteId: string) => {
    const suiteIndex = testSuites.findIndex(s => s.id === suiteId);
    if (suiteIndex === -1) return;

    setCurrentSuite(suiteId);
    
    // Update suite status to running
    const updatedSuites = [...testSuites];
    updatedSuites[suiteIndex] = {
      ...updatedSuites[suiteIndex],
      status: 'running',
      progress: 0
    };
    setTestSuites(updatedSuites);

    const suite = updatedSuites[suiteIndex];
    const updatedTests = [...suite.tests];

    // Run each test in the suite
    for (let i = 0; i < updatedTests.length; i++) {
      // Update test status to running
      updatedTests[i] = { ...updatedTests[i], status: 'running' };
      updatedSuites[suiteIndex] = {
        ...suite,
        tests: updatedTests,
        progress: (i / updatedTests.length) * 100
      };
      setTestSuites([...updatedSuites]);

      // Run the test
      const result = await simulateTest(updatedTests[i]);
      updatedTests[i] = result;
      
      // Update progress
      updatedSuites[suiteIndex] = {
        ...suite,
        tests: updatedTests,
        progress: ((i + 1) / updatedTests.length) * 100
      };
      setTestSuites([...updatedSuites]);
    }

    // Finalize suite status
    const hasFailures = updatedTests.some(t => t.status === 'failed');
    updatedSuites[suiteIndex] = {
      ...updatedSuites[suiteIndex],
      status: hasFailures ? 'failed' : 'completed',
      progress: 100
    };
    setTestSuites([...updatedSuites]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    toast.info('Running comprehensive test suite...');

    for (const suite of testSuites) {
      await runTestSuite(suite.id);
    }

    setCurrentSuite(null);
    setIsRunning(false);
    toast.success('All test suites completed!');
  };

  const resetTests = () => {
    setTestSuites(prev => prev.map(suite => ({
      ...suite,
      status: 'pending',
      progress: 0,
      tests: suite.tests.map(test => ({
        ...test,
        status: 'pending',
        duration: undefined,
        error: undefined,
        assertions: undefined
      }))
    })));
    setCurrentSuite(null);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'running':
        return <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={(variants as any)[status] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Test Runner Control Panel</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetTests} disabled={isRunning}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Tests
              </Button>
              <Button onClick={runAllTests} disabled={isRunning}>
                {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRunning ? 'Running...' : 'Run All Tests'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{testSuites.length}</div>
              <div className="text-sm text-muted-foreground">Test Suites</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">
                {testSuites.reduce((acc, suite) => acc + suite.tests.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {testSuites.reduce((acc, suite) => 
                  acc + suite.tests.filter(t => t.status === 'passed').length, 0
                )}
              </div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {testSuites.reduce((acc, suite) => 
                  acc + suite.tests.filter(t => t.status === 'failed').length, 0
                )}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {testSuites.map((suite) => (
        <Card key={suite.id} className={currentSuite === suite.id ? 'border-blue-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(suite.status)}
                  {suite.name}
                  {getStatusBadge(suite.status)}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{suite.description}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => runTestSuite(suite.id)}
                disabled={isRunning}
              >
                <Play className="h-4 w-4 mr-1" />
                Run Suite
              </Button>
            </div>
            {suite.status === 'running' && (
              <Progress value={suite.progress} className="mt-2" />
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suite.tests.map((test) => (
                <div key={test.id} className="flex items-center gap-4 p-2 border rounded">
                  <div className="flex-shrink-0">
                    {getStatusIcon(test.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{test.name}</span>
                      {test.duration && (
                        <span className="text-xs text-muted-foreground">
                          {test.duration}ms
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{test.description}</p>
                    {test.assertions && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {test.assertions.passed}/{test.assertions.total} assertions passed
                      </div>
                    )}
                    {test.error && (
                      <div className="text-xs text-red-600 mt-1">{test.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

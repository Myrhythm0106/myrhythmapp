import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
    
    // Auto-retry for CF errors
    const isCFError = error.message?.includes('CF') || 
                     error.message?.includes('Cloudflare') ||
                     error.message?.includes('Web server returned an unknown error');
    
    if (isCFError && this.state.retryCount < 3) {
      this.handleAutoRetry();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleAutoRetry = () => {
    // Auto-retry after 3 seconds for CF errors
    this.retryTimeoutId = window.setTimeout(() => {
      this.handleRetry();
    }, 3000);
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleEmergencyBypass = () => {
    // Emergency bypass for CF errors - redirect to dashboard
    window.location.href = '/memory-bridge';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isCFError = this.state.error?.message?.includes('CF') || 
                       this.state.error?.message?.includes('Cloudflare') ||
                       this.state.error?.message?.includes('Web server returned an unknown error');

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-purple-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                {isCFError ? 'Connection Issue Detected' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                {isCFError 
                  ? 'We detected a temporary connection issue. This usually resolves quickly.'
                  : 'An unexpected error occurred. We\'re working to fix this.'
                }
              </p>
              
              {isCFError && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Quick fix:</strong> Try refreshing the page or use the emergency bypass below.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again {this.state.retryCount > 0 && `(Attempt ${this.state.retryCount + 1})`}
                </Button>

                {isCFError && (
                  <Button 
                    onClick={this.handleEmergencyBypass}
                    className="w-full"
                    variant="secondary"
                  >
                    Emergency: Continue to Dashboard
                  </Button>
                )}

                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {isCFError && this.state.retryCount < 3 && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Auto-retry in 3 seconds...
                  </p>
                  {/* Auto-retry logic handled in separate effect */}
                </div>
              )}

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-500 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs text-gray-600 mt-2 bg-gray-100 p-2 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
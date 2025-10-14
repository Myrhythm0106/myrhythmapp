import React from 'react';
import { Brain, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorFallbackProps {
  error?: Error;
  errorId?: string;
  onRetry: () => void;
  onGoHome: () => void;
}

export function ErrorFallback({ error, errorId, onRetry, onGoHome }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-purple-50 to-neural-blue-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 bg-white/90 backdrop-blur-sm shadow-xl">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange-100 to-brand-orange-200 flex items-center justify-center">
              <Brain className="h-10 w-10 text-brand-orange-600" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="text-gray-600">
              Don't worry - this happens sometimes. Your data is safe.
            </p>
          </div>

          {/* Error details (collapsed by default) */}
          {error && (
            <details className="text-left">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                Technical details
              </summary>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-mono text-gray-700 break-all">
                  {error.message}
                </p>
                {errorId && (
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {errorId}
                  </p>
                )}
              </div>
            </details>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </Button>

            <Button
              onClick={onGoHome}
              variant="outline"
              className="w-full border-clarity-teal-300 text-clarity-teal-700 hover:bg-clarity-teal-50 hover:text-clarity-teal-900 transition-colors"
              size="lg"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Button>
          </div>

          {/* Support message */}
          <p className="text-sm text-gray-500">
            If this keeps happening, please contact support with Error ID: <span className="font-mono">{errorId}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}

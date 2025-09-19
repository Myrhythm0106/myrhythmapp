import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const SubscribeCancel = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/subscribe');
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-slate-800">
            Subscription Cancelled
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-slate-600 mb-4">
              No worries! Your payment was cancelled and you haven't been charged anything.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              You can continue using MyRhythm with the free plan or try subscribing again when you're ready.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 mb-2">Free plan includes:</h4>
            <ul className="space-y-1 text-sm text-slate-600">
              <li>• 3 Memory Bridge recordings per month</li>
              <li>• Basic Next Step Summary</li>
              <li>• 1 support circle member</li>
              <li>• Basic calendar features</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleTryAgain}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue with Free Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscribeCancel;
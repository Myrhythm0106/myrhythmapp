import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              No worries! Your payment was cancelled and you haven't been charged.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              You can continue with limited preview access or try upgrading again when ready.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Free Preview includes:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 2 basic insights</li>
              <li>• Primary rhythm profile</li>
              <li>• Overall wellness score</li>
              <li>• 3 recordings per month</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/subscribe')}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={() => navigate('/memory-bridge')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue with Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

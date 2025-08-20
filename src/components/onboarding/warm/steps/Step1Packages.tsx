import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Heart, HelpCircle } from 'lucide-react';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

interface PackageOption {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  gradient: string;
  icon: React.ComponentType<any>;
}

const packages: PackageOption[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '£7.99',
    period: '/month',
    features: [
      'Memory Bridge capture',
      'Basic calendar sync',
      '60-second check-ins',
      'Essential ACTS tracking',
      'Email support'
    ],
    gradient: 'from-memory-emerald-500 to-brain-health-500',
    icon: Zap
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '£14.99',
    period: '/month',
    features: [
      'Everything in Starter',
      'Smart scheduling suggestions',
      'Advanced ACTS repository',
      'Support circle watchers',
      'Priority support',
      'Weekly coaching insights'
    ],
    popular: true,
    gradient: 'from-brain-health-500 to-clarity-teal-500',
    icon: Crown
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '£24.99',
    period: '/month',
    features: [
      'Everything in Plus',
      'AI-powered SMARTest time optimization',
      'Automatic meeting generation',
      'Advanced analytics & insights',
      'Custom integration options',
      '1-on-1 coaching sessions'
    ],
    gradient: 'from-clarity-teal-500 to-sunrise-amber-500',
    icon: Heart
  }
];

interface Step1PackagesProps {
  onPackageSelect: (packageId: string) => void;
  onHelpClick: () => void;
}

export function Step1Packages({ onPackageSelect, onHelpClick }: Step1PackagesProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePackageSelect = async (packageId: string) => {
    setSelectedPackage(packageId);
    setIsLoading(true);
    
    // Show loading for 3-4 seconds
    setTimeout(() => {
      setIsLoading(false);
      onPackageSelect(packageId);
    }, 3500);
  };

  return (
    <>
      <LoadingOverlay 
        isVisible={isLoading} 
        message="Setting up your secure checkout..."
      />
      
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-brain-health-900">
            Choose Your MyRhythm Plan
          </h2>
          <p className="text-lg text-brain-health-700 max-w-2xl mx-auto">
            Start your journey to cognitive empowerment. All plans include our brain-friendly design 
            and coach-like guidance.
          </p>
          
          {/* Help Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onHelpClick}
            className="text-brain-health-600 hover:text-brain-health-800 hover:bg-brain-health-50"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Need help choosing? Open User Guide
          </Button>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            const isSelected = selectedPackage === pkg.id;
            
            return (
              <Card 
                key={pkg.id}
                className={`
                  relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl
                  ${isSelected ? 'ring-2 ring-brain-health-500 shadow-lg' : ''}
                  ${pkg.popular ? 'border-sunrise-amber-300 shadow-lg' : 'border-brain-health-200'}
                `}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${pkg.gradient} flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-brain-health-900">
                    {pkg.name}
                  </CardTitle>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-brain-health-800">
                      {pkg.price}
                    </div>
                    <div className="text-brain-health-600">
                      {pkg.period}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-memory-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-brain-health-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${pkg.gradient} hover:opacity-90 text-white py-6 text-lg font-semibold`}
                    disabled={isLoading}
                  >
                    {isLoading && isSelected ? 'Processing...' : `Choose ${pkg.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Annual Savings Note */}
        <div className="text-center">
          <p className="text-brain-health-600 text-sm">
            💡 <strong>Save 20%</strong> when you choose annual billing (coming soon)
          </p>
        </div>
      </div>
    </>
  );
}
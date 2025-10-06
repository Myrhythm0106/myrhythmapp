import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardFooter() {
  const navigate = useNavigate();

  return (
    <div className="mt-16 pt-8 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-base text-slate-600">
          Your journey to cognitive wellness starts here
        </p>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/user-guide')}
            className="text-slate-600 hover:text-brain-health-700 transition-colors"
          >
            <Book className="h-4 w-4 mr-2" />
            User Guide
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/faq')}
            className="text-slate-600 hover:text-brain-health-700 transition-colors"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Need Help?
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchIntegrationProps {
  children: React.ReactNode;
}

export function GlobalSearchIntegration({ children }: GlobalSearchIntegrationProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Global keyboard shortcut for search
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K or Cmd+K for search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        navigate('/search?source=keyboard');
      }

      // Escape key for help/back navigation
      if (event.key === 'Escape') {
        const currentPath = location.pathname;
        
        // If in a complex flow, provide context-sensitive help
        if (currentPath.includes('/mvp/') || currentPath.includes('/onboarding')) {
          // Don't interfere with existing modals/forms
          if (!document.querySelector('[role="dialog"]:not([aria-hidden="true"])')) {
            navigate('/search?q=help with onboarding&context=' + encodeURIComponent(currentPath));
          }
        }
      }

      // F1 for direct help
      if (event.key === 'F1') {
        event.preventDefault();
        navigate('/search?q=help&context=' + encodeURIComponent(location.pathname));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Add global search data attributes for better indexing
  useEffect(() => {
    const currentPath = location.pathname;
    let pageContext = '';
    
    if (currentPath.includes('/memory-bridge')) {
      pageContext = 'memory-bridge recording conversation capture';
    } else if (currentPath.includes('/assessment')) {
      pageContext = 'assessment evaluation cognitive brain health';
    } else if (currentPath.includes('/onboarding') || currentPath.includes('/mvp/')) {
      pageContext = 'onboarding setup getting-started';
    } else if (currentPath.includes('/dashboard')) {
      pageContext = 'dashboard overview main features';
    } else if (currentPath.includes('/calendar')) {
      pageContext = 'calendar scheduling tasks rhythm';
    }

    // Set search context on body for better search indexing
    document.body.setAttribute('data-search-context', pageContext);
    document.body.setAttribute('data-current-page', currentPath);

    return () => {
      document.body.removeAttribute('data-search-context');
      document.body.removeAttribute('data-current-page');
    };
  }, []);

  return <>{children}</>;
}
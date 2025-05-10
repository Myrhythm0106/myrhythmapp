
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the dashboard page directly
    navigate('/dashboard');
    
    // Show a toast notification
    toast.info("Redirecting to dashboard...");
  }, [navigate]);

  // Provide a fallback redirect
  return <Navigate to="/dashboard" replace />;
};

export default Index;

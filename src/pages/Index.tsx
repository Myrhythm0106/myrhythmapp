
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the dashboard page directly
    navigate('/dashboard', { replace: true });
    
    // Show a toast notification
    toast.info("Welcome to MyRhythm");
  }, [navigate]);

  // Provide a fallback redirect
  return <Navigate to="/dashboard" replace />;
};

export default Index;

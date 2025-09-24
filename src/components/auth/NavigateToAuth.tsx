import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function NavigateToAuth() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/auth');
  }, [navigate]);
  
  return null;
}

import { useState, useEffect } from 'react';

interface UserData {
  userType: string;
  name?: string;
  email?: string;
}

export function useUserData(): UserData {
  const [userData, setUserData] = useState<UserData>({
    userType: 'brain-injury'
  });

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    const savedUserType = localStorage.getItem('userType') || 'brain-injury';
    setUserData({
      userType: savedUserType,
      name: 'User',
      email: 'user@example.com'
    });
  }, []);

  return userData;
}

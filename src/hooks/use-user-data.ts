
import { useState, useEffect } from 'react';
import { UserType, UserData } from '@/types/user';

export function useUserData(): UserData {
  const [userData, setUserData] = useState<UserData>({
    userType: 'cognitive-optimization'
  });

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    const savedData = localStorage.getItem('myrhythm_user_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData({
        userType: parsed.userType || parsed.type || 'cognitive-optimization',
        name: parsed.name || 'User',
        email: parsed.email || 'user@example.com'
      });
    } else {
      // Default user data
      setUserData({
        userType: 'cognitive-optimization',
        name: 'User',
        email: 'user@example.com'
      });
    }
  }, []);

  return userData;
}

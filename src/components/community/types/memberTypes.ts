
export interface Member {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  role: 'family' | 'friend' | 'caregiver' | 'healthcare' | 'colleague';
  status: 'active' | 'pending';
  isAdmin?: boolean;
}

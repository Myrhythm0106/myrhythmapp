
export type UserType = 'cognitive-optimization' | 'empowerment' | 'brain-health' | 'brain-injury' | 'caregiver' | 'wellness' | 'medical-professional' | 'colleague';

export interface UserData {
  userType: UserType;
  name?: string;
  email?: string;
}

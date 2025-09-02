
export type UserType = 'brain-injury' | 'caregiver' | 'cognitive-optimization' | 'wellness' | 'medical-professional' | 'colleague' | 'other';

export interface UserData {
  userType: UserType;
  name?: string;
  email?: string;
}

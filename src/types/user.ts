
export type UserType = 'brain-injury' | 'caregiver' | 'cognitive-optimization' | 'wellness' | 'medical-professional';

export interface UserData {
  userType: UserType;
  name?: string;
  email?: string;
}

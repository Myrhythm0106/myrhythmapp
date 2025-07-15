
export type UserType = 'brain-injury' | 'caregiver' | 'cognitive-optimization' | 'wellness';

export interface UserData {
  userType: UserType;
  name?: string;
  email?: string;
}

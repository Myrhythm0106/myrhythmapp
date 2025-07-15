
export type UserType = 'brain-injury' | 'dementia' | 'general' | 'caregiver';

export interface UserData {
  userType: UserType;
  name?: string;
  email?: string;
}


export type UserType = 'brain-injury' | 'caregiver' | 'cognitive-optimization' | 'wellness' | 'medical-professional' | 'colleague' | 'other' | 'student' | 'executive' | 'post-recovery';

export type CaregiverRole = 'primary' | 'secondary' | 'healthcare' | 'friend';

export interface UserData {
  userType: UserType;
  name?: string;
  email?: string;
  // Caregiver-specific fields
  supportedUserId?: string;
  caregiverRole?: CaregiverRole;
  // Dashboard preference
  dashboardVariant?: 'brain-injury' | 'caregiver' | 'standard';
}

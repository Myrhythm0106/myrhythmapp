
import { Member } from "../types/memberTypes";

export const getRoleBadgeColor = (role: Member['role']) => {
  switch (role) {
    case 'family':
      return 'bg-blue-100 text-blue-800';
    case 'friend':
      return 'bg-green-100 text-green-800';
    case 'caregiver':
      return 'bg-purple-100 text-purple-800';
    case 'healthcare':
      return 'bg-red-100 text-red-800';
    case 'colleague':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

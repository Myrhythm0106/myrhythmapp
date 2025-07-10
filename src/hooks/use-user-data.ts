
import { useState } from "react";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";

export interface UserData {
  name: string;
  userType: UserType;
}

// Convert legacy user types to new category types
const convertUserType = (legacyType: string): UserType => {
  switch (legacyType) {
    case "tbi":
    case "abi":
      return "brain-injury";
    case "mental-health":
      return "cognitive-optimization";
    case "caregiver":
      return "caregiver";
    case "new":
    default:
      return "wellness";
  }
};

export function useUserData() {
  // In a real app, we would fetch the user data from a database or API
  const [userData] = useState<UserData>({
    name: "Alex",
    userType: convertUserType("tbi"), // This will convert "tbi" to "brain-injury"
  });

  return userData;
}

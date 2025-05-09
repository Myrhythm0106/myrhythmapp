
import { useState } from "react";

export type UserType = "tbi" | "abi" | "mental-health" | "caregiver" | "new";

export interface UserData {
  name: string;
  userType: UserType;
}

export function useUserData() {
  // In a real app, we would fetch the user data from a database or API
  const [userData] = useState<UserData>({
    name: "Alex",
    userType: "tbi",
  });

  return userData;
}

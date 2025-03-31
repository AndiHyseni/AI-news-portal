import { Role } from "../types/auth/login";

export const checkForRoles = (givenRoles: Role, targetRoles: Role) => {
  return Object.values(targetRoles).some((targetRoles) =>
    givenRoles.includes(targetRoles)
  );
};

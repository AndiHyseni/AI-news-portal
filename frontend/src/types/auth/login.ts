export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  expiresAt: string;
  refreshToken: string;
  token: string;
  userEmail: string;
  userRole?: Role;
  username: string;
}

export enum Role {
  REGISTERED = "Registered",
  ADMIN = "Admin",
}

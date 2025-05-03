export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  userId?: string;
  username?: string;
  email?: string;
  roles?: string[];
}

export interface UserContext {
  isAuthenticated: boolean;
  token: string | null;
  userId?: string;
  username?: string;
  email?: string;
  roles?: string[];
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export enum Role {
  REGISTERED = "registered",
  ADMIN = "admin",
}

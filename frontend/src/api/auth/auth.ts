import { axiosInstance } from "../config";
import { BaseUrl } from "../../enums/baseUrl";
import { LoginRequest, LoginResponse } from "../../types/auth/login";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/Account/login`,
    credentials
  );

  // Store the token in localStorage
  if (data.token) {
    localStorage.setItem("jwt", data.token);
  }

  return data;
};

export const logout = async (): Promise<void> => {
  // Clear token from localStorage
  localStorage.removeItem("jwt");
  // Optionally call backend logout endpoint if needed
  // await axiosInstance.post(`${BaseUrl.DEVELOPMENT}/Account/logout`);
};

export const refreshToken = async (
  token: string | null
): Promise<LoginResponse> => {
  if (!token) throw new Error("No token provided");

  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/Account/refreshToken`,
    { token, refreshToken: localStorage.getItem("refreshToken") }
  );

  if (data.token) {
    localStorage.setItem("jwt", data.token);
  }

  return data;
};

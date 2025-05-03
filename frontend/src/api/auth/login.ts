import { LOGIN } from "../../enums/auth/url";
import { BaseUrl } from "../../enums/baseUrl";
import { LoginRequest, LoginResponse } from "../../types/auth/login";
import { axiosInstance } from "../config";

export const login = async (payload: LoginRequest) => {
  try {
    const response = await axiosInstance.post(
      `${BaseUrl.DEVELOPMENT}/Account/${LOGIN.LOGIN}`,
      payload
    );

    // Check if we got an error response with a statusMessage
    if (response.data && response.data.statusIsOk === false) {
      console.error("Server returned error:", response.data.statusMessage);
      throw new Error(response.data.statusMessage || "Login failed");
    }

    // Validate the response contains a token
    if (!response.data || !response.data.token) {
      console.error("Invalid response format from server:", response.data);
      throw new Error("Invalid response from server - missing token");
    }

    return response.data as LoginResponse;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

import { axiosInstance } from "../config";
import { BaseUrl } from "../../enums/baseUrl";

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const { data } = await axiosInstance.get<{ user: UserProfile }>(
      `${BaseUrl.DEVELOPMENT}/Account/user/${userId}`
    );
    return data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

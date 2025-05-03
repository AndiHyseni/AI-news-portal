import { axiosInstance } from "../config";
import { BaseUrl } from "../../enums/baseUrl";

interface RoleResponse {
  roles: string[];
}

export const getUserRoles = async (userId: string): Promise<string[]> => {
  try {
    const { data } = await axiosInstance.get<RoleResponse>(
      `${BaseUrl.DEVELOPMENT}/api/roles/user/${userId}`
    );
    return data.roles || [];
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return [];
  }
};

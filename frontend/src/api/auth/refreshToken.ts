import { AxiosError } from "axios";
import { REFRESH_TOKEN } from "../../enums/auth/url";
import { BaseUrl } from "../../enums/baseUrl";
import { LoginResponse } from "../../types/auth/login";
import { axiosInstance } from "../config";

export const refreshToken = async (token: string | null) => {
  if (!token) {
    throw new AxiosError("Token is required");
  }
  const { data } = await axiosInstance.get<LoginResponse>(
    `${BaseUrl.DEVELOPMENT}/${REFRESH_TOKEN.REFRESH_TOKEN}`,
    {
      headers: {
        token,
      },
    }
  );

  return data;
};

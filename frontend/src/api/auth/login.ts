import { LOGIN } from "../../enums/auth/url";
import { BaseUrl } from "../../enums/baseUrl";
import { LoginPayload, LoginResponse } from "../../types/auth/login";
import { axiosInstance } from "../config";

export const login = async (payload: LoginPayload) => {
  const { data } = await axiosInstance.post<LoginResponse>(
    `${BaseUrl.DEVELOPMENT}/${LOGIN.LOGIN}`,
    payload
  );
  return data;
};

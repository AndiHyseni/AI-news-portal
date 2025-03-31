import { REGISTER } from "../../enums/auth/url";
import { BaseUrl } from "../../enums/baseUrl";
import { LoginResponse } from "../../types/auth/login";
import { RegisterPayload } from "../../types/auth/register";
import { axiosInstance } from "../config";

export const register = async (payload: RegisterPayload) => {
  const { data } = await axiosInstance.post<LoginResponse>(
    `${BaseUrl.DEVELOPMENT}/${REGISTER.REGISTER}`,
    payload
  );
  return data;
};

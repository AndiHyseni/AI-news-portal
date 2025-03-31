import axios from "axios";
import { BaseUrl } from "../enums/baseUrl";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((request) => {
  if (!request.headers) {
    request.headers = {};
  }
  request.headers.Accept = "application/json";

  // Attach token to request if available
  const jwtToken = localStorage.getItem("jwt");
  if (jwtToken) {
    request.headers.Authorization = `Bearer ${jwtToken}`;
  }

  // Send content-type with POST/PUT requests
  if (request.method === "POST" || request.method === "PUT") {
    request.headers["Content-Type"] = "application/json";
  }

  return request;
});

// if request succeeds with status code 1001 throw error
axiosInstance.interceptors.response.use((response) => {
  if (response.data.code === 1001) {
    localStorage.removeItem("jwt");
    window.location.reload();
  }

  return response;
});

export const BASE_DOMAIN_URL =
  process.env.REACT_APP_ENV === "dev" ? BaseUrl.DEVELOPMENT : "";

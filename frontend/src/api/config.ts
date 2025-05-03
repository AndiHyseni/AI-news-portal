import axios from "axios";
import { BaseUrl } from "../enums/baseUrl";

export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token in every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const BASE_DOMAIN_URL =
  process.env.REACT_APP_ENV === "dev" ? BaseUrl.DEVELOPMENT : "";

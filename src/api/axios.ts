// src/api/axiosInstance.ts
import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`; // 🔁 Replace with your actual base URL

const apiClient  = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Axios error:", error); // Add this line
    if (error.response?.status === 401) {
      console.warn("Unauthorized - token may be expired or invalid");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient ;

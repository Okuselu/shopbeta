// src/utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Update with your backend's base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

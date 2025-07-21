// client/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://flockshop-jjzt.onrender.com",
});

api.interceptors.request.use((config) => {
  const email = localStorage.getItem("userEmail");
  if (email) {
    config.headers["x-user-email"] = email;
  }
  return config;
});

export default api;

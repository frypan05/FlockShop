// client/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Replace with Render URL when deployed
});

api.interceptors.request.use((config) => {
  const email = localStorage.getItem("userEmail");
  if (email) {
    config.headers["x-user-email"] = email;
  }
  return config;
});

export default api;

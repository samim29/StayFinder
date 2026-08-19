import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = "Network error. Check your connection and try again.";
    } else if (error.response.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  },
);

export default api;

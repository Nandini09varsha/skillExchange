import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// 🔐 Attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 🔄 Auto-logout when token is expired or invalid
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.data?.code;
    const status = error.response?.status;

    if (
      status === 401 &&
      (code === "TOKEN_EXPIRED" ||
        code === "TOKEN_INVALID" ||
        code === "NO_TOKEN")
    ) {
      // Clear stale auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login (works outside React components)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export default API;

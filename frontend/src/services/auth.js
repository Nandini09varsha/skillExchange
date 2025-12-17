import axios from "axios";
const API = axios.create({
  baseURL: "http://127.0.0.1:5001/api",
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
  (error) => Promise.reject(error)
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

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api",
  timeout: 10000,
});

// Injeta token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pmp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redireciona para login se token expirar
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("pmp_token");
      localStorage.removeItem("pmp_usuario");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
